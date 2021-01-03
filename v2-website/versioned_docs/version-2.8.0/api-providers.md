---
id: api-providers
title: providers
original_id: api-providers
---

## Purpose

Data Provider gives to us a way for managing a provider or a groups of providers without having to import them directly. For that purpose, it exports the `providers` object.

The purpose of this utility is to give the possibility of delegate the configuration of providers to a piece that should have not known about used providers (usually the "main app").

The `providers` object gives to us some methods that could be usually wanted to be executed over many providers at a time, as `cleanCache`, `on`, etc. But the most interesting method is the `config` one, which __works for already instantiated providers, and also for providers instantiated in the future__, so it does not matter if we first call to the `providers.config` method, or if we first instantiate the providers. This is a very important detail, because the piece at charge of configuring providers does not need to know about specific providers, and the providers don't need to know about the base configuration, which boost the reusability. This is the reason why Data Provider gives to us a __"tag based configuration system"__.

## Defining tags

We can define `tags` for our providers when creating them, and later we can use those tags for configuring at a time all providers containing certain tag.

Origin addons should usually automatically add his own tag to the beginning of the provided `tags` array when we create a provider. This is made to allow configuring easily all providers of a same type, as `axios`, "localStorage", etc.

As a brief example for a better understand before describing the API:

```javascript
import { Axios } from "@data-provider/axios";

const todos = new Axios("todos", {
  url: "/todos",
  tags: ["need-auth"]
});
```

```javascript
import { providers } from "@data-provider/core";

// Set baseUrl option for all providers created by the Axios addon
providers.getByTag(`axios`).config({
  baseUrl: "http://localhost:3100"
});

// Set auth headers for all providers containing tag "need-auth"
providers.getByTag("need-auth").config({
  headers: {
    "Authorization": "Bearer foo-token"
  }
});
```

## `providers` Methods

Note that, even when the object is called `providers`, all described methods here also are applied to instantiated selectors.

The `providers` object has next methods:

<hr/>

### `getByTag(tag)`

#### Arguments

* __`tag`__ _(String)_: Tag to use for selecting providers.

#### Returns

A group of providers containing the provided tag. The returned "selection" has its own methods, which are described in the [providers selection Methods](#providers-selection-methods) chapter below.

#### Example

```javascript
import { providers } from "@data-provider/core";

const books = new Axios("books-from-api", {
  url: "/books",
  tags: ["api"]
});

providers.getByTag("api").cleanCache();
```

<hr/>

### `getById(id)`

#### Arguments

* __`id`__ _(String)_: Id to use for selecting providers.

#### Returns

A selection of providers with the provided id (normally only one). The returned "selection" has its own methods, which are describe in the [providers selection Methods](#providers-selection-methods) chapter below.

> The `providers` object also contains all methods described in the `providers selection` Methods chapter. The only difference is that the `provider selection` will contain all instantiated providers and selectors.

#### Example

```javascript
import { providers } from "@data-provider/core";

const books = new Axios("books-from-api", {
  url: "/books",
  tags: ["api"]
});

providers.getById("books-from-api").cleanCache();
```

### `onNewProvider(listener)`

Executes the provided listener each time a new provider is created. Useful to add listeners or call to methods of providers that are not even created _(indispensable in a "lazy loading" scenario)_.

#### Arguments

* __`listener`__ _(Function)_: Listener function. It will receive the created provider as first argument.

#### Returns

_(Function)_ A function that unsubscribes the added listener.

#### Example

```javascript
import { providers } from "@data-provider/core";

providers.onNewProvider((provider) => {
  console.log(`Added new provider with id: ${provider.id}`);
});

const books = new Axios("books-from-api", {
  url: "/books"
});

// Added new provider with id: books-from-api"
```

### `clear()`

Clears all registered providers, which will not be available any more for selecting them using previously mentioned `providers` methods. This method is intended to be used for testing and internal usage only.

## `providers selection` Methods

<hr/>

### `onNewProvider(listener)`

Same method than [described before](#onnewproviderlistener), but it can also be used scoped for an specific selection of providers.

#### Example

```javascript
import { providers } from "@data-provider/core";

providers.getByTag("api").onNewProvider((provider) => {
  console.log(`Added new api provider with id: ${provider.id}`);
});

const books = new Axios("books-from-api", {
  url: "/books",
  tags: ["api"]
});

// Added new api provider with id: books-from-api
```

### `config(configuration)`

Calls to the `config` method of selected providers with provided configuration object. Note that this method works for already instantiated providers, and also for providers instantiated in the future, so it does not matter if we first call to the `providers.config` method, or if we first instantiate the providers.

#### Arguments

* __`configuration`__ _(Object)_: An object containing configuration to be set into the providers. _Read the [Provider api](api-provider.md) and [Selector api](api-selector.md)_ pages for further info about available options.

#### Returns

The `providers selection` object itself.

#### Example

```javascript
providers.getByTag(`axios`).config({
  baseUrl: "http://localhost:3000"
});
```

<hr/>

### `cleanCache(options)`

Cleans the cache of selected providers and selectors.

#### Arguments

* __`options`__ _(Object)_: Object that can contain next properties:
  * __`force`__ _(Boolean)_: If `true`, will force to clean the cache immediately, ignoring the `cleanCacheThrottle` option.

#### Returns

The `providers selection` object itself.

#### Examples

```javascript
providers.getByTag(`axios`).cleanCache();
// clean cache of Axios providers
```

```javascript
providers.cleanCache({ force: true });
// clean cache of all providers and selectors right now, ignoring the `cleanCacheThrottle` option
```

<hr/>

### `resetState()`

Resets the state of selected providers and selectors. Read the [providers and selectors methods chapter](api-providers-and-selectors-methods.md) for further info.

#### Returns

The `providers selection` object itself.

#### Examples

```javascript
providers.getByTag(`axios`).resetState();
// reset state of all Axios providers
```

```javascript
providers.resetState();
// reset state of all providers
```

<hr/>

### `on(eventName, listener)`

Subscribes the provided listener to the given `eventName` in selected providers. Read the [providers and selectors methods](api-providers-and-selectors-methods.md) and [the API Events](api-events.md) chapters for further info.

#### Returns

_(Function)_: A function that unsubscribes all added listeners.

#### Examples

```javascript
providers.getByTag(`axios`).on("readStart", () => {
  console.log("A provider is fetching from the API");
});
```

<hr/>

### `onChild(eventName, listener)`

Subscribes the provided listener to the given `eventName` in selected providers children. Read the [providers and selectors methods](api-providers-and-selectors-methods.md) and [the API Events](api-events.md) chapters for further info.

#### Returns

_(Function)_: A function that unsubscribes all added listeners.

#### Examples

```javascript
providers.getByTag(`axios`).onChild("readStart", () => {
  console.log("A parametrized request to the API has started");
});
```

<hr/>

### `once(eventName, listener)`

Subscribes the provided listener to the given `eventName` in selected providers for once time. Read the [providers and selectors methods](api-providers-and-selectors-methods.md) and [the API Events](api-events.md) chapters for further info.

#### Returns

_(Function)_: A function that unsubscribes all added listeners.

#### Examples

```javascript
providers.getByTag(`axios`).once("readStart", () => {
  console.log("A provider has started fetching from the API");
  console.log("This message will be shown only once");
});
```

<hr/>

### `onceChild(eventName, listener)`

Subscribes the provided listener to the given `eventName` in selected providers children for once time. Read the [providers and selectors methods](api-providers-and-selectors-methods.md) and [the API Events](api-events.md) chapters for further info.

#### Returns

_(Function)_: A function that unsubscribes all added listeners.

#### Examples

```javascript
providers.getByTag(`axios`).onceChild("readStart", () => {
  console.log("A parametrized request to the API has started");
  console.log("This message will be shown only once");
});
```

<hr/>

### `call(methodName, ...arguments)`

Calls to the given method using given arguments in selected providers and selectors.

#### Returns

(Array): Array containing the returned results by each one of the providers and selectors. The array will contain `undefined` in the positions corresponding to providers that didn't have the provided method.

#### Examples

```javascript
providers.getById("book").call("update", {
  title: "foo"
});
```

<hr/>

## `providers selection` getters

<hr/>

### `size`

#### Returns

_(Number)_: Total count of selected providers and selectors, including children (queried instances).

#### Example

```javascript
const size = providers.getByTag(`axios`).size;
console.log(`Currently there are ${size} axios providers`);
console.log(`There are ${providers.size} providers and selectors in total`);
```

### `elements`

#### Returns

_(Array)_: Array containing all selected providers and selectors.

#### Example

```javascript
providers.elements.forEach(provider => {
  console.log(`Found provider with id ${provider.id}`);
});
```

## Tips

* Use the `providers` object only for configuring options that should not be coupled to the initialization of the provider itself. This can help to make your providers reusable across applications.
* Use the addons automatic tags for configuring all providers of the same type at a time _(for example, use the `axios` tag to set the `baseUrl` of the API if you are using the [`axios` addon][data-provider-axios])_

[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios