---
id: api-providers
title: providers
---

## Brief explanation

Data Provider gives to us a way for managing a provider or a groups of providers without having to import them directly. For that purpose, it exports the `providers` object.

The purpose of this utility is to give the possibility of delegate the configuration of providers to a piece that should have not known about used providers (usually the "main app").

The `providers` object gives to us some methods that could be usually wanted to be executed over many providers at a time, as `cleanCache`, `on`, etc. But the most interesting method is the `config` one, which __works for already instantiated providers, and also for providers instantiated in the future__, so it does not matter if we first call to the `providers.config` method, or if we first instantiate the providers. This is a very important detail, because the piece at charge of configuring providers does not need to know about specific providers, and the providers don't need to know about the base configuration, which boost the reusability. This is the reason why Data Provider gives to us a __"tag based configuration system"__.

## Defining tags

We can define `tags` for our providers when creating them, and later we can use those tags for configuring at a time all providers containing certain tag.

Origin addons should usually automatically add his own tag to the beggining of the provided `tags` array when we create a provider. This is made to allow configuring easily all providers of a same type, as "axios", "localStorage", etc.

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
providers.getByTag("axios").config({
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

A group of providers containing the provided tag. The returned "selection" has its own methods, which are describe in the [providers selection Methods](#providers-selection-methods) chapter below.

<hr/>

### `getById(id)`

#### Arguments

* __`id`__ _(String)_: Id to use for selecting providers.

#### Returns

A selection of providers with the provided id (normally only one). The returned "selection" has its own methods, which are describe in the [providers selection Methods](#providers-selection-methods) chapter below.

> The `providers` object also contains all methods described in the `providers selection` Methods chapter. The only difference is that the `provider selection` will contain all instantiated providers and selectors.

## `providers selection` Methods

<hr/>

### `config(configuration)`

Calls to the `config` method of selected providers with provided configuration object. Note that this method works for already instantiated providers, and also for providers instantiated in the future, so it does not matter if we first call to the `providers.config` method, or if we first instantiate the providers.

#### Arguments

* __`configuration`__ _(Object)_: An object containing configuration to be set into the providers.

#### Returns

The `providers selection` object itself.

<hr/>

### `cleanCache()`

Cleans the cache of selected providers and selectors.

#### Returns

The `providers selection` object itself.

<hr/>

### `resetState()`

Resets the state of selected providers and selectors. Read the [providers and selectors methods chapter](api-providers-and-selectors-methods.md) for further info.

#### Returns

The `providers selection` object itself.

<hr/>

### `on(eventName, listener)`

Subscribes the provided listener to the given `eventName` in selected providers. Read the [providers and selectors methods](api-providers-and-selectors-methods.md) and [the API Events](api-events.md) chapters for further info.

#### Returns

_(Function)_: A function that unsubscribes all added listeners.

<hr/>

### `onChild(eventName, listener)`

Subscribes the provided listener to the given `eventName` in selected providers children. Read the [providers and selectors methods](api-providers-and-selectors-methods.md) and [the API Events](api-events.md) chapters for further info.

#### Returns

_(Function)_: A function that unsubscribes all added listeners.

<hr/>

### `once(eventName, listener)`

Subscribes the provided listener to the given `eventName` in selected providers for once time. Read the [providers and selectors methods](api-providers-and-selectors-methods.md) and [the API Events](api-events.md) chapters for further info.

#### Returns

_(Function)_: A function that unsubscribes all added listeners.

<hr/>

### `onceChild(eventName, listener)`

Subscribes the provided listener to the given `eventName` in selected providers children for once time. Read the [providers and selectors methods](api-providers-and-selectors-methods.md) and [the API Events](api-events.md) chapters for further info.

#### Returns

_(Function)_: A function that unsubscribes all added listeners.

<hr/>

### `call(methodName, ...arguments)`

Calls to the given method using given arguments in selected providers and selectors.

#### Returns

(Array): Array containing the returned results by each one of the providers and selectors. The array will contain `undefined` in the positions corresponding to providers that didn't have the provided method.

<hr/>

## `providers selection` getters

<hr/>

### `size`

#### Returns

_(Number)_: Total count of selected providers and selectors, including children (queried instances).

### `elements`

#### Returns

_(Array)_: Array containing all selected providers and selectors.
