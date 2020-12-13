---
id: version-2.2.0-api-provider
title: Provider
original_id: api-provider
---

A Provider defines an specific resource of a data origin.

When we create a Provider, we'll get a provider instance that should be alive during the whole live of our application, as it is going to be at charge of the cache, avoiding unnecessary resources consumption while the data origin has not changed.

> The Provider class should not be used directly to create providers. It is the base from which specific origins implementations should extend. Here are described the arguments and options that are common to all origins addons. For specific options of each addon please read its own documentation.

## `Provider(id, [options])`

### Arguments

1. __`id`__ _(String)_: Id for the provider instance. It is used internally as namespace in the store. It is also useful for debugging purposes, and can be used for configuring the provider instance [using the `providers` object](api-providers.md).

2. __`options`__ _(Object)_: Options will differ depending of the type of origin. Here are described the properties in the options object that are common to all origins addons. For specific options of different origin addons, please refer to its own documentation.
	* __`cache`__ _(Boolean)_: If `false`, will disable the cache, and the `readMethod` defined by the origin will be called always, which could result in a negative performance impact. It is `true` by default, and normally should not be disabled.
	* __`cacheTime`__ _(Number)_: Milliseconds. After this time, the cache will be invalidated and the `readMethod` will be executed again when `read` is called. When the cache is invalidated it does not trigger a `cleanCache` event.
	* __`cleanCacheInterval`__ _(Number)_: Milliseconds. The cache is automatically cleaned every defined interval. The `cleanCache` event is triggered each time the cache is cleaned. When the cache is cleaned by any other process, the interval counter is resetted to zero. Setting this option to `null` will remove previously defined interval.
	* __`tags`__ _(Array of Strings)_: Defines tags for the provider instance, which can be used afterwards to manage groups of providers [using the `providers` object](api-providers.md). _Origin addons should usually automatically add his own tag to the beginning of the provided array, to allow configuring easily all providers of a same type._
	* __`initialState`__ _(Object)_: Object containing `loading`, `error` and `data` properties, which will define the initial state of the provider, before its `read` method is executed for the first time. This is useful to give a default value for the data, so you don't have to make extra format checks in your views _(`data && data.map`)_. It is also useful to define the initial loading state, which can be defined as true, which will save extra renders _(as the read method is executed normally by the views theirself, the first time a selector is read it should have `loading` state as false, then immediately `true`, then `false` when data is retrieved. Setting `initialState.loading` property to `true` will save that extra render in the initialization)._

### Returns

A `provider` instance, which methods are described in the [providers and selectors methods](api-providers-and-selectors-methods.md) page of these docs.

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
// { loading: true, data: [], error: null }

```

### Tips

* Use clear identificators in your providers. It will improve the development experience, as Data Provider and addons usually use them when printing messages into the console.
* When an `id` is duplicated, Data Provider will automatically append a suffix to it and will print a warning.
* Define always the `initialState`, it will save you extra format checks in your views, and will save an initial extra render, as described in the Arguments API.
