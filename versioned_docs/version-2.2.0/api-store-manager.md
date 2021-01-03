---
id: api-store-manager
title: storeManager
original_id: api-store-manager
---

## Purpose

Data Providers uses [Redux][redux] to handle the `loading`, `data` and `error` states of the providers and selectors. This was made due to the great ecosystem of Redux, which allows to easily develop addons to connect that states to any other library or framework, allowing to Data Provider to be focused on solving other problems, as the caches, queries, selectors, etc.

Data Provider implements internally its own Redux store to allow the usage of the library without having to make an extra job creating one for it, but it can be migrated to another store using the `storeManager`.

## Methods

### `setStore(store, [namespace])`

Sets a new Redux store to be used by Data Provider instead of the default one.

#### Arguments

* __`store`__ _(Redux store)_: Redux store to be used by Data Provider.
* __`namespace`__ _(String)_: Namespace of the store where Data Provider will keep states of providers and selectors. By default its value is `dataProvider`.

## Getters

### `reducer`

#### Returns

_(Object)_ Data Provider Redux reducer, ready to be added to your own store using [Redux `combineReducers`][redux-combine-reducers].

### `store`

#### Returns

_(Object)_ Current Data Provider Redux store.

### `namespace`

#### Returns

_(String)_ Current namespace in the store where Data Provider keeps states of providers and selectors.

### `state`

#### Returns

_(Object)_ Direct access to the Data Provider state. Uses Redux `getState` method to get all state, and returns all state contents inside the Data Provider current `namespace`.

## Example

In this example we are going to see how to tell Data Provider to use one store of your creation instead of the default one. This operation could me made at any moment, as Data Provider migrates all its current state to the new one when the `setStore` method is called, but it is strongly recommended to do it at the beginning of the initialization of your app.

As an extra, the example also shows how to initialize [Redux devTools][redux-devtools] in order to improve the front-end developer experience.

```javascript
import { createStore, combineReducers } from "redux";
import { storeManager } from "@data-provider/core";

const DATA_PROVIDER_NAMESPACE = "data";

const store = createStore(
  combineReducers({
    [DATA_PROVIDER_NAMESPACE]: storeManager.reducer
  }),
  window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

storeManager.setStore(store, DATA_PROVIDER_NAMESPACE);
```

> Note how the usage of Redux `combineReducers` allows you to add your own reducers without any conflict with the Data Provider state.

[redux]: https://redux.js.org/
[redux-combine-reducers]: https://redux.js.org/api/combinereducers
[redux-devtools]: https://github.com/reduxjs/redux-devtools
