---
id: api-events
title: Events
original_id: api-events
---

Data Provider includes an event emitter that allows to be continually informed about what is happening and react in consequence.

__Normally, using the events API directly  should not be necessary__, as Data Provider addons usually make this job for you and provide all needed reactivity, but there are some cases in which can be useful.

## Adding listeners

There are four methods available for adding listeners to providers or selectors: [`on`](api-providers-and-selectors-methods.md#oneventname-listener), [`once`](api-providers-and-selectors-methods.md#onceeventname-listener), [`onChild`](api-providers-and-selectors-methods.md#onchildeventname-listener) and [`onceChild`](api-providers-and-selectors-methods.md#oncechildeventname-listener).

Their APIS are described in the [providers and selectors methods API page](api-providers-and-selectors-methods.md), and their names should be descriptive enough to fully understand the purpose of each one, but, anyway:

* Methods prefixed with `once` automatically unsubscribe the provided listener after its first execution.
* Methods suffixed with `Child` subscribe the listener to events happening on any [children (queried instances)](api-providers-and-selectors-methods.md#queryqueryvalue) of the provider or selector.

## Arguments

As all mentioned methods require same arguments to be executed, we will use the `on` method as example in the API description:

### `on(eventName, listener)`

#### Arguments

* `eventName` _(String)_: Event name to subscribe to. Read [events names chapter in this page](#event-names) for further info.
* `listener` _(Function)_: The callback to be invoked when the specific `eventName` is dispatched.

## Event names

> In this chapter are described the `eventNames` common to all providers. Addons can emit its own `eventNames`, which should be described in its own documentation.

### `eventName`

Available event names are:

* `readStart`: Dispatched when the [`read` method](api-providers-and-selectors-methods.md#read) has not cache and internally calls to the addon `readMethod`. When the provider or selector result is cached, this event is not dispatched.
* `readSuccess`: Dispatched when the [`read` method](api-providers-and-selectors-methods.md#read) is resolved successfully. When the provider or selector result is cached, this event is not dispatched.
* `readError`: Dispatched when the [`read` method](api-providers-and-selectors-methods.md#read) is rejected with an error.
* `cleanCache`: Dispatched when the [`cleanCache` method](api-providers-and-selectors-methods.md#cleancache) is executed.
* `init`: Dispatched when a new provider or selector instance is created.
* `resetState`: Dispatched when the [`resetState` method](api-providers-and-selectors-methods.md#resetstate) is executed.

### `eventName` wildcard

You can also use next wildcard to listen to any of the events described before:

* `*`: Dispatched when any of the previously described event names are dispatched.

> When using wildcards, the original `eventName` will be received as first argument in the `listener` function.

### `eventNames`

All described event names are exported as constants in order to facilitate their usage. They are available at the `eventNames` property at top-level export of the library. The map of equivalences is:

* `eventNames.READ_START`: `readStart`
* `eventNames.READ_SUCCESS`: `readSuccess`
* `eventNames.READ_ERROR`: `readError`
* `eventNames.CLEAN_CACHE`: `cleanCache`
* `eventNames.INIT`: `init`
* `eventNames.RESET_STATE`: `resetState`
* `eventNames.ANY`: `*`

## `listener` API

The provided `listener` function should follow the next API:

### `listener([eventName|child], [child])`

#### Arguments

* `eventName` _(String)_: When the listener was subscribed using the `*` wildcard, it will receive the `eventName` causing the execution as first argument.
* `child` _(provider or selector)_ : When the listener was subscribed using a child method (`onChild` or `onceChild`) it will receive the child causing the execution as first argument, or in second argument in case the listener was subscribed using the `*` wildcard.

## Examples

#### Basic example

```javascript
import { eventNames } from "@data-provider/core";
import { books } from "data/books"; // books is a provider

books.on(eventNames.READ_START, eventName => {
  console.log("books has started read");
});

books.read();
// Books has started read
```

#### Using wildcard

```javascript
import { eventNames } from "@data-provider/core";
import { books } from "data/books"; // books is a provider

books.on(eventNames.ANY, eventName => {
  console.log(`books ${eventName} event was dispatched`);
});

books.cleanCache();
// books cleanCache event was dispatched
books.read();
// books readStart event was dispatched
```

#### Child events

```javascript
import { eventNames } from "@data-provider/core";
import { books } from "data/books"; // books is a provider

const authorBooks = books.query({ author: 2});

books.onChild(eventNames.CLEAN_CACHE, child => {
  console.log(`Cache of child of books with id ${child.id} was cleaned`);
});

books.onChild(eventNames.ANY, (eventName, child) => {
  console.log(`${eventName} was dispatched in child with id ${child.id}`);
});

await authorBooks.cleanCache();
// Cache of child of books with id books-{"author":2} was cleaned
// cleanCache was dispatched in child with id books-{"author":2}
```