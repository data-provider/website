---
id: version-2.6.0-api-provider
title: Provider
original_id: api-provider
---

A Provider defines an specific resource of a data origin.

When we create a Provider, we'll get a provider instance that should be alive during the whole live of our application, as it is going to be at charge of the cache, avoiding unnecesary resources compsumption while the data origin has not changed.

> The Provider class should not be used directly to create providers. It is the base from which specific origins implementations should extend (read the ["How to create origin addons"](addons-creating-origin-addons.md) chapter for further info). Here are described the arguments and options that are common to all origins addons. For specific options of each addon please read its own documentation.

## `Provider(id, [options])`

### Arguments

1. __`id`__ _(String)_: Id for the provider instance. It is used internally as namespace in the store. It is also useful for debugging purposes, and can be used for configuring the provider instance [using the `providers` object](api-providers.md).

2. __`options`__ _(Object)_: Options will differ depending of the type of origin. Here are described the properties in the options object that are common to all origins addons. For specific options of different origin addons, please refer to its own documentation.
  * __`cache`__ _(Boolean)_: If `false`, it will disable the cache, and the `readMethod` defined by the origin will be called always, which could result in a negative performance impact. It is `true` by default, and normally it should not be disabled. __This option can be changed using the `config` method of the provider instance__.
  * __`cacheTime`__ _(Number)_: Miliseconds. After this time, the cache will be invalidated and the `readMethod` will be executed again when `read` is called. When the cache is invalidated it does not trigger a `cleanCache` event. Setting it to zero or null makes the cache never being invalidated. __This option can be changed using the `config` method of the provider instance__.
  * __`cleanCacheInterval`__ _(Number)_: Miliseconds. The cache is automatically cleaned every defined interval. The `cleanCache` event is triggered each time the cache is cleaned. When the cache is cleaned by any other process, the interval counter is resetted to zero. Setting this option to `null` will remove previously defined interval. __This option can be changed using the `config` method of the provider instance__.
  * __`tags`__ _(Array of Strings)_: Defines tags for the provider instance, which can be used afterwards to manage groups of providers [using the `providers` object](api-providers.md). _Origin addons should usually automatically add his own tag to the beggining of the provided array, to allow configuring easily all providers of a same type._
  * __`initialState`__ _(Object|Function)_: Object containing `loading`, `loaded`, `error` and `data` properties, which will define the initial state of the provider, before its `read` method is executed for the first time. This is useful to give a default value for the data, so you don't have to make extra format checks in your views _(`data && data.map`)_. It is also useful to define the initial loading state, which can be defined as true, which will save extra renders _(as the read method is executed normally by the views theirself, the first time a selector is read it should have `loading` state as false, then inmediatelly `true`, then `false` when data is retrieved. Setting `initialState.loading` property to `true` will save that extra render in the initialization)._ A function can be also provided, then, it will receive the current `query` as argument, and the returned object will be used as `initialState`.

### Returns

A `provider` instance, which common methods are described in the [providers and selectors methods](api-providers-and-selectors-methods.md) page of these docs.

### Example

```javascript
import { Axios } from "@data-provider/axios";

const provider = new Axios("example", {
  url: "/foo-url",
  tags: ["foo-tag"],
  initialState: {
    loading: true,
    data: []
  }
});

console.log(provider.id);
// example

console.log(provider.options);
// { cache: true, tags: ["axios", "foo-tag"], url: "/foo-url" }

console.log(provider.state);
// { loading: true, loaded: false, data: [], error: null }

```

### Tips

* Use clear identificators in your providers. It will improve the development experience, as Data Provider and addons usually use them when printing messages into the console.
* When an `id` is duplicated, Data Provider will automatically append a suffix to it and will print a warning.
* Define always the `initialState`, it will save you extra format checks in your views, and will save an initial extra render, as described in the Arguments API.

### Overwritable methods for creating addons

In the Provider class there are some special methods and getters that can be overwritten when creating custom origins (read the ["How to create origin addons"](addons-creating-origin-addons.md) for further info):

### `initialState`

Getter used to calculate the initial state of the provider when it is instantiated. It usually returns the `initialState` from options as defined above, but this getter can be overwritten by plugins in order to change this behavior. For example, you could retrieve the real value from the data origin in case it is synchronous and return it as "data" property of the "initialState", this is how the addon ["browser-storage"](https://github.com/data-provider/browser-storage) works, for example.

### `configMethod(newOptions)`

This method is called when the instance is created and every time the `config` method is called. It receives the new options as argument, which are the result of extending the previous with the received ones.

### `readMethod(...args)`

This is the method called to calculate the provider data, so __it is the most important one when creating addons__. It should return a promise when the origin is asynchronous, so the resolved result will be saved in the data state. It can also simply return a value when the origin is synchronous. If the method throws an error or the returned promise is rejected, the provider will fill the error state, trigger the error event and clean the cache.
Remember that you can use the `this.queryValue` and other getters to get the current query value, etc. The arguments of the method are open, so this method will receive the same ones that are passed to the provider `read` method when it is called (addons can define its own custom options for the read method)

### `getChildQueryMethod(newQuery)`

This method is used to calculate the `queryValue` in the new child instance returned when the query method is executed. It normally returns the extension of the original query with the new one, but some addons need to make a deep extend instead, for example.

```javascript
// default behavior: getChildQueryMethod() {return { ...this.queryValue, ...query };}
const queried = provider.query({ foo: "foo"}).query({ "var": "var" });
console.log(queried.queryValue) // {foo, "foo", var: "var"}
```

### `createChildMethod`

This method is used to return a new instance when the `query` method is executed. It normally returns a new instance using the same constructor. This method rarely has to be overwritten, it is used internally by Selectors because they do not accomplish with the Provider arguments described in this chapter, so they need to transform the options when they are created.

### Internal methods for creating addons

There are also other methods and getters intended to be used only internally by addons that shouldn't be overwritten:

### `initialStateFromOptions`

This getter returns the result of the `initialState` option originally defined as an option to the provider. It is useful when overwritting the `initialState` getter, because addons can consult the original option and act in consequence.

### `emit(eventName, data)`

Addons can also emit its own events. Read the ["events"](api-events.md) chapter for further info.


