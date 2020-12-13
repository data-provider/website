---
id: version-2.8.0-getting-started
title: Get started
original_id: getting-started
---

## Getting started with Data Provider

Data Provider is a data provider _(surprise!)_ with states and built-in cache for JavaScript apps.

The main target of the library are front-end applications, but it could be used also in [Node.js][nodejs].

It helps you __providing async data__ to your components informing them about __loading and error states__.
It also provides a __cache layer__, so you don´t have to worry about when to read the data, and allows you to __combine the results of different data providers__ using a syntax very similar to the known [Reselect][reselect], recalculating them only when one of the dependencies cache is cleaned.

As its states are managed with [Redux][redux], you can take advantage of his large ecosystem of addons, which will improve the developer experience. _(You don't need to use Redux directly in your application if you don't want, the library includes its own internal store for that purpose, which [can be migrated to your own store](api-store-manager.md) for debugging purposes, for example)._

You can use Data Provider with [React][react], or with any other view library. [Separated addons are available](addons-intro.md) for that purpose, as [@data-provider/react][data-provider-react].

Data Provider is __agnostic about data origins__, so it can be used to read data from a REST API, from localStorage, or from any other origin. Choose one of the [available addons](addons-intro.md) depending of the type of the origin you want to read from, as [@data-provider/axios][data-provider-axios], or [@data-provider/browser-storage][data-provider-browser-storage].

It has a __light weight__, 4.2KB gzipped in UMD format _(you have to add the Redux weight to this)_, and addons usually are even lighter.

## Main features

As a summary, what Data Provider gives to you is:

* Cache
* Loading, error and data states
* Queryable
* Selectors
* Event emitter

And, the most important thing... __promotes separation of concerns, isolating the data layer, and separating your data cache from your global state.__

[![Data Provider architecture schema](assets/schemas/data-provider-architecture.jpg)](/img/architecture-scheme.png)

## Installation

Data Provider is available as a package in the NPM registry:

```bash
npm i --save @data-provider/core redux
```

It is also available as a precompiled UMD package that defines a `window.dataProvider` global variable. The UMD package can be used as a `<script>` tag directly, you only have to remember to [first load Redux with another `<script>` tag][redux-installation].

Read the [installation](installation.md) page for further info.

## Basic example

Define two basic providers and combine them using a simple Selector. We will use the [@data-provider/axios][data-provider-axios] origin to illustrate this example, but the syntax is applicable to all types of origins.

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

Take advantage of the [@data-provider/react][data-provider-react] addon, and use hooks to retrieve the data automatically from a React component:

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

_NOTE: This is a very basic example of what @data-provider/react can do. In a real application, this could be solved even easier using one of the HOCs that the library provides._ Check the [@data-provider/react][data-provider-react] docs for further info.

## Next steps

Previous examples don't show the real power of Data Provider, and how it could be used to isolate completely your components from the data layer, where a great part of the business rules should reside.

In next chapters we will try to show you how the cache of a "collection" can be cleaned automatically when a "model" is updated, how to use selectors dependencies to completely manage all your data using them, how to define "queries" for the origins _(as url parameters or query strings)_ can be delegated completely to the selectors, etc.

But first, you should [read the "motivation" page](motivation.md) to really understand why this library exists, what problems can solve, or, at least, what bad patterns can help to prevent.

[nodejs]: https://nodejs.org/en/
[redux]: https://redux.js.org/
[redux-installation]: https://redux.js.org/introduction/installation
[react]: https://reactjs.org/
[data-provider-react]: https://www.npmjs.com/package/@data-provider/react
[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios
[data-provider-browser-storage]: https://www.npmjs.com/package/@data-provider/browser-storage
[reselect]: https://github.com/reduxjs/reselect
