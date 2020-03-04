---
id: getting-started
title: Intro
---

## Getting started with Data Provider

Data Provider is a data provider _(surprise!)_ with states ands built-in cache for JavaScript apps.

The main target of the library are front-end applications, but it could be used also in Node.js.

It helps you providing async data to your components informing them about loading and error states.
It also provides a cache layer, so you don´t have to worry about when to read the data, and allows you to combine the results of different data origins using a syntax very similar to the known Reselect, recalculating them only when one of the dependencies cache is cleaned.

As its states are managed with Redux, you can take advantage of his large ecosystem of addons, which will improve the developer experience. _(You don't need to use Redux directly in your application if you don't want, the library includes its own internal store for that purpose, which can be migrated to your own store)_

You can use Data Provider with React, or with any other view library. Separated plugins are available for that purpose, as @data-provider/react.

Data Provider is agnostic about data origins, so it can be used to read data from a REST API, from localStorage, or from any other origin. Choose one of the available plugins depending of the type of the origin you want to read from, as @data-provider/axios, or @data-provider/browser-storage.

It has a light weight, about 4kb gzipped _(you have to add the Redux weight to this)_, and addons usually are even lighter.

## Main features

As a summary, what Data Provider gives to you is:

* Cache
* Loading, error and data states
* Queryable
* Selectors
* Event emitter

And, the most important thing... promotes isolation from the data layer.

## Installation

Data Provider is available as a package in the NPM registry:

```bash
npm i --save @data-provider/core redux
```

It is also available as a precompiled UMD package that defines a `window.dataProvider` global variable. The UMD package can be used as a `<script>` tag directly, you only have to remember to first load Redux with another `<script>` tag.

Read the [installation](installation.md) page for further info.

## Basic example

Define two basic providers and combine them using a simple Selector. We will use the @data-provider/axios origin to illustrate this example, but the syntax is applicable to all types of origins.

```javascript

import { Selector } from "@data-provider/core";
import { Axios } from "@data-provider/axios";

/* 
Define two new providers of type Axios, passing the specific options required
by this origin type (url). The first argument defines an id for the provider, which
will used as namespace in the store, and is also useful for debugging purposes.
*/
export const books = new Axios("books-api", {
  url: "/api/books"
});
export const authors = new Axios("authors-api", {
  url: "/api/authors"
});

/* 
Define a new Selector that will combine the results of the
previously defined origins.
*/
export const booksWithAuthor = new Selector(
  authors,
  books,
  (authorsResults, booksResults) => {
    return booksResults.map(book => ({
      ...book,
      author: authorsResults.find(author => author.id === book.author)
    }));
  }
);

```

Now we have defined the providers and the selector, we can illustrate how the cache works:

```javascript
const runExample = async () => {
  /*
  Intentionality read the selector twice. Only the first one will request authors
  and books to the server.
  */
  booksWithAuthor.read();
  booksWithAuthor.read();

  /*
  Read the selector and trace the results, which will be a collection of books
  including the information about the author. The data is not requested again.
  */
  const data = await booksWithAuthor.read();
  console.log(data);

  // Clean the cache of the "authors" origin.
  authors.cleanCache();

  /*
  Read the selector again, now the "authors" origin is requested again as
  its cache is clean, but books are not requested.
  */
  await booksWithAuthor.read();
};

runExample();
```

## Basic example of usage with React

Take advantage of the @data-provider/react addon, and use hooks to retrieve the data from a React component:

```javascript
import React from "react";
import { useData, useLoading } from "@data-provider/react";

import { booksWithAuthor } from "data/bookstore";
import Loading from "components/loading";
import BooksList from "components/books";

const Books = () => {
  const books = useData(booksWithAuthor);
  const loading = useLoading(booksWithAuthor);

  if (loading) {
    return <Loading />;
  }
  return <BooksList books={books} />;
};

export default Books;
```

_NOTE: This is a very basic example of what @data-provider/react can do. In a real application, this could be solved even easier using one of the HOCs that the library provides._ Check the @data-provider/react page for further info.

## Next steps

Previous examples don't show the real power of Data Provider, and how it should be used to isolate completely your components from the data layer, where a great part of the business rules should reside.

In next chapters we will try to show you how the cache of a "collection" can be cleaned automatically when a "model" is updated, how creating "queries" for the origins _(as url parameters or query strings)_ can be delegated completely to the providers, etc.

But first, you should [read the "motivation" page](motivation) to really understand why this library exists, what problems can solve, or, at least, what bad patterns can help to prevent.


