---
id: version-2.5.0-api-providers-and-selectors-methods
title: Providers and selectors methods
sidebar_label: Methods
original_id: api-providers-and-selectors-methods
---

This chapter describes all methods common to providers and selectors. If you haven't done it already, we recommend you to first read the [Selector API](api-selector.md) and [Provider API](api-provider.md) to deeply learn what they are, and how to create them.

## Methods

<hr/>

### `read()`

Dispatches the read method. In the case of providers, it will dispatch the internal `readMethod` implemented by specific origin addons. In case of selectors, it will dispatch the `read` method of all needed dependencies and execute the `selector function` as described in the [Selector API](api-selector.md).

When there is no cache for the resource, a `readStart` event will be triggered at the beginning, and a `readSuccess` event will be triggered at the end (or `readError` in case of error). Read the [events API chapter](api-events.md) for further info.

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

<hr/>

### `addQuery(name, queryMaker)`

This methods allows to add custom `query` methods to the providers and selectors. This methods are only `parsers` receiving a query value, then transform it and call to the original provider `query` method with the transformed one. Sounds complicated, but it is easy to understand if you read the purpose and next examples.

#### Purpose

Origins addons normally require to receive the `queryValue` with an specific format when its `query` method is called. (For example, the [@data-provider/axios][data-provider-axios] addon requires an object containing `urlParams` or `queryString` properties). This require to know that `specific` syntax to pieces building the queries. Normally pieces using providers should be abstracted from the fact of which type of provider are they using, so here is where the `addQuery` method enters. It allows to abstract another actors from knowing which is the required format when querying a provider or selector.

#### Arguments

* `name` _(String)_: Name of the new custom query method to be defined, which will be accessible as `provider.queries[name]`
* `queryMaker` _(Function)_: Function receiving any value, and returning a  `queryValue` ready to be used by the `query` method of the provider or selector.

#### Returns

_(`undefined`)_, but it adds a new method to the [`queries`](#queries) object of the provider or selector. When this method is called, it will return a new `queried` instance as described in the [`query` method api](#queryqueryvalue). _It also adds an entry to the [`queryMethods`](#querymethods) object of the provider containing the `queryMaker` for making easier to test the custom queries._

#### Example

_Note: next examples are based on providers created with the [@data-provider/axios][data-provider-axios] addon._

```javascript
// Without using a custom query method:
let book = books.query({ urlParams: { author: 2 }});
book.read(); // Fetch to /books/2

// Definining a custom query method:
books.addQuery("ofAuthor", author => ({ urlParams: { author }}));

// From now, querying by author can be made as:
book = books.queries.ofAuthor(2);
book.read(); // Fetch to /books/2
```

<hr/>

### `config(options)`

Defines options. Will overwrite those properties already defined in the `options` object when the provider or selector was instantiated _(read [Provider api](api-provider.md) and [Selector api](api-selector.md))_. The resultant configuration will be the extension of the initial `options` object and all options previously defined using this method.

There are some options that only have effect when they are defined in the initial `options` method, as `tags`, `initialState`and `id` in the case of Selectors. For specific options of addons, please read its own documentation, as each one can define its own `configMethod`.

#### Arguments

* `options` _(Object)_: Object containing options. Read the [Provider api](api-provider.md) and [Selector api](api-selector.md) pages for further info.

#### Example

_Note: next example is based on a provider created with the [@data-provider/axios][data-provider-axios] addon._

```javascript
books.config({
  baseUrl: "http://localhost:3000";
});
```

<hr/>

### `cleanCache()`

Cleans the cache of selector or provider, and also the cleans the cache of all its "children" _(queried instances obtained using its `query` method)_. _In a practical example, this means that cleaning the cache of an API origin requesting to "/api/books", will also clean the cache of "/api/books?author=2"_

A `cleanCache` event will be triggered at the beginning. Read the [events API chapter](api-events.md) for further info.

#### Example

```javascript
books.read(); // Request to /books
books.read(); // Does not request, as Promise is cached.
books.cleanCache();
books.read(); // Request to /books
```

<hr/>

### `cleanDependenciesCache()`

Cleans the cache of all dependencies of a selector. If called on a provider, it only cleans de provider cache (it is equivalent to call to `cleanCache`).

#### Example

```javascript
booksAndAuthors.read(); // Selector reading `books` and `authors` providers. Request to /books and /authors
booksAndAuthors.read(); // Does not request, as Promise is cached.
booksAndAuthors.cleanDependenciesCache();
booksAndAuthors.read(); // As providers cache was cleaned, the selector is read again, and both providers requests are repeated.
```

<hr/>

### `resetState()`

Resets the `data`, `loading`, `loaded` and `error` state properties to its original state (the ones defined in the `initialState` option, or the default ones `{ data:undefined, error: null }` if no `initialState` was defined).

Note: Take into account that this method does not cleans the cache, you have to do it by yourself using the `cleanCache` method. Otherwise, you will receive the data when using the `read` method, as it is cached, but the `data` in the state will remain empty, as it is not being defined again until a `read` method is executed with the cache empty.

#### Example

```javascript
await books.read();
console.log(books.state);
// { data: [{ title: "Don Quijote " }], loading: false, loaded: true, error: null}

books.resetState();
// { loading: false, loaded: false, error: null}
```

<hr/>

### `on(eventName, listener)`

Adds `listener` to the given `eventName`. Read the [events API chapter](api-events.md) for further info.

#### Arguments

* `eventName` _(String)_: Event name to subscribe to.
* `listener` _(Function)_: The callback to be invoked when the specific `eventName` is dispatched.

#### Returns

_(Function)_: A function that unsubscribes the `listener`.

#### Example

```javascript
books.on("readSuccess", () => {
  console.log("Books were successfully read");
});

await books.read();
// Books were successfully read
```

<hr/>

### `onChild(eventName, listener)`

Adds `listener` to the given `eventName` when it occurs in any of the provider or selector "children" (queried instances). Read the [events API chapter](api-events.md) for further info.

#### Arguments

* `eventName` _(String)_: Event name to subscribe to.
* `listener` _(Function)_: The callback to be invoked when the specific `eventName` is dispatched in any of the selector or provider "children".

#### Returns

_(Function)_: A function that unsubscribes the `listener`.

#### Example

```javascript
authorBooks = books.queries.byAuthor(2);

books.onChild("readSuccess", () => {
  console.log("Queried books were successfully read");
});

await authorBooks.read();
// Queried books were successfully read
```

<hr/>

### `once(eventName, listener)`

Adds `listener` to the given `eventName`. The `listener` will be automatically unsubscribed after its first execution. Read the [events API chapter](api-events.md) for further info.

#### Arguments

* `eventName` _(String)_: Event name to subscribe to.
* `listener` _(Function)_: The callback to be invoked when the specific `eventName` is dispatched.

#### Returns

_(Function)_: A function that unsubscribes the `listener`.

#### Example

```javascript
books.once("readSuccess", () => {
  console.log("Books were successfully read");
});

await books.read();
// Books were successfully read
await books.read();
// ...
```

<hr/>

### `onceChild(eventName, listener)`

Adds `listener` to the given `eventName` when it occurs in any of the provider or selector "children" (queried instances). The `listener` will be automatically unsubscribed after its first execution. Read the [events API chapter](api-events.md) for further info.

#### Arguments

* `eventName` _(String)_: Event name to subscribe to.
* `listener` _(Function)_: The callback to be invoked when the specific `eventName` is dispatched in any of the selector or provider "children".

#### Returns

_(Function)_: A function that unsubscribes the `listener`.

#### Example

```javascript
authorBooks = books.queries.byAuthor(2);

books.onceChild("readSuccess", () => {
  console.log("Queried books were successfully read");
});

await authorBooks.read();
// Queried books were successfully read
await authorBooks.read();
// ...
```

## Getters

<hr/>

### `state`

#### Returns

_(Object)_: Current state of the provider or selector, containing `data`, `loading`, `loaded` and `error` properties.

#### Example

```javascript
console.log(books.state);
// { data: [{ title: "Don Quijote " }], loading: false, loaded: true, error: null}
```

<hr/>

### `id`

#### Returns

_(String)_: Id of the provider or selector.

#### Example

```javascript
books = new Axios("books-from-api", {
  url: "/books"
});

console.log(books.id);
// books-from-api
```

<hr/>

### `queryValue`

#### Returns

_(Object)_ or _(undefined)_: Value defined to the [`query`](#queryqueryvalue) method which created the provider or selector instance. If the instance is a "parent" instance and was not created using the [`query`](#queryqueryvalue) method, returns `undefined`.

#### Example

```javascript
let book = books.query({ urlParams: { author: 2 }});

console.log(book.queryValue);
// { urlParams: { author: 2 }}
```

<hr/>

### `queries`

#### Returns

_(Object)_: Returns object containing [custom `query` methods defined using the `addQuery` method](#addqueryname-querymaker).

#### Example

```javascript
// Definining a custom query method:
books.addQuery("ofAuthor", author => ({ urlParams: { author }}));

// From now, querying by author can be made as:
book = books.queries.ofAuthor(2);
book.read(); // Fetch to /books/2
```

<hr/>

### `children`

#### Returns

_(Array)_: Array containing all [children instances created with the `query` method](#queryqueryvalue). Each element in the array is a provider or selector itself, and contains all methods described in this page.

#### Example

```javascript
let book = books.query({ urlParams: { author: 2 }});

console.log(books.children);
// [book]
```

### `parent`

#### Returns

_(provider)_, _(selector)_ or _(undefined)_: If the instance was created with the [`query` method](#queryqueryvalue) returns the parent instance. If not, returns `undefined`.

#### Example

```javascript
let book = books.query({ urlParams: { author: 2 }});

console.log(book.parent);
// [books]
```

### `options`

#### Returns

_(Object)_: Current options, read the [`config` method](#configoptions) api for further info.

#### Example

_Note: next example is based on a provider created with the [@data-provider/axios][data-provider-axios] addon._

```javascript
books = new Axios("books-from-api", {
  url: "/books"
});

books.config({
  baseUrl: "http://localhost:3000";
});

console.log(books.options);
// { url: "/books", baseUrl: "http://localhost:3000", tags: ["axios"], id: "books-from-api" }
```

### `queryMethods`

#### Returns

_(Object)_: Object containing all custom query methods previously defined using the [`addQuery` method](#addqueryname-querymaker). The object will contain properties correspondent to each custom query "name", and the correspondent value will be the provided `queryMaker`. This object is exposed for making easier the proccess of testing custom query methods.

#### Example

```javascript
books.addQuery("ofAuthor", author => ({ urlParams: { author }}));

console.log(books.queryMethods.ofAuthor(2));
// { urlParams: { author: 2 }}
```


[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios
[data-provider-browser-storage]: https://www.npmjs.com/package/@data-provider/browser-storage
