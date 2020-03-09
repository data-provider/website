---
id: api-providers-and-selectors-methods
title: Providers and selectors methods
sidebar_label: Methods
---

This chapter describes all methods common to providers and selectors. If you haven't done it already, we recommend to first read the [Selector API](api-selector.md) and [Provider API](api-provider.md) to deeply learn what they are, and how create them.

## Methods

<hr/>

### `read()`

Dispatchs the read method. In the case of providers, it will dispatch the internal `readMethod` implemented by specific origin addons. In case of selectors, it will dispatch the `read` method of all needed dependencies and execute the `selector function` as described in the [Selector API](api-selector.md).

When there is no cache for the resource, a `readStart` method will be triggered at the beggining. A `readSuccess` method will be triggered at the end (or `readError` in case of error). Read the [events API chapter](api-events.md) for further info.

#### Returns

_(Promise)_ Promise resolved with the data resultant when reading the provider, or rejected with an `Error`.

#### Example

```javascript
books.read().then(data => {
  console.log("Books result", data);
}).catch(error => {
  console.log("Reading books was rejected with error", error);
});
```

<hr/>

### `query(queryValue)`

Creates a new child instance of the provider and returns it. The new instance will maintain the provided `object` as its `queryValue`, and will apply it when its read method is called. If an instance with the same `queryValue` was created before, then it will returned instead of creating a new one _(in order to maintain its cache, config, etc.)_

Returned instance will maintain a relation with its "parent" in some way. Internally they are called "children", because when the cache of the "parent" resource is cleaned, all the children caches are cleaned too. _(For example, cleaning the cache of an API origin requesting to "/api/books", will also clean the cache of "/api/books?author=2")_

Different Provider addons will use the current `queryValue` in different ways when consulting the specific data origin _(for example, [@data-provider/axios][data-provider-axios] will use the `queryValue` to define url params or query strings when requesting to the API, but [@data-provider/browser-storage][data-provider-browser-storage] will access to an specific key of the value saved in the browser storage)_.

When you use the `query` method of a provider or selector that also was created using `query`, the resultant `queryValue` will be the extension of the provided one and the previous one. In other words, queries are "chainable" and maintain the "scope". See the examples below for better understand.

#### Arguments

* `queryValue` _(Object)_: Object to be set as `queryValue` in the returned provider or selector.

#### Returns

_(provider or selector)_: Queried child instance of the provider _(or selector)_ in which the method was executed.

#### Examples

_Note: next examples are based on providers created with the [@data-provider/axios][data-provider-axios] addon._

```javascript
const book = books.query({ urlParams: { author: 2 }});
book.read(); // Fetch to /books/2
```

```javascript
const booksFilteredByYear = books.query({ queryString: { year: 1605 }});
booksFilteredByYear.read(); // Fetch to /books/?year=1605

const booksFilteredByYearAndAuthor = booksFilteredByYear.query({ queryString: { author: 1 }});
booksFilteredByYearAndAuthor.read(); // Fetchs to /books/?year=1605&author=1

books.cleanCache();
// Clean caches of books, booksFilteredByYear, and booksFilteredByYearAndAuthor
```

## Getters

[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios
[data-provider-browser-storage]: https://www.npmjs.com/package/@data-provider/browser-storage
