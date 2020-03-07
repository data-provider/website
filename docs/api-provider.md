---
id: api-provider
title: Provider
---

A Provider defines an specific resource of a data origin.

When we create a Provider, we'll get a provider instance that should be alive during the whole live of our application, as it is going to be at charge of the cache, avoiding unnecesary resources compsumption while the data origin has not changed.

> The Provider class should not be used directly to create providers. It is the base from which specific origins implementations should extend. Here are described the arguments and options that are common to all origins addons. For specific options of each addon please read its own documentation.

## `Provider(id, [options])`

### Arguments

1. `id` _(String)_: Id for the provider instance. It is used internally as namespace in the store. It is also useful for debugging purposes, and can be used for configuring the provider instance [using the `providers` object](api-providers.md).

2. `options` _(Object)_: Options will differ depending of the type of origin. Here are described the properties in the options object that are common to all origins addons. For specific options of different origin addons, please refer to its own documentation.
	* `cache` _(Boolean)_: If `false`, will disable the cache, and the `readMethod` defined by the origin will be called always, which could result in a negative performance impact. It is `true` by default, and normally should not be disabled.
	* `tags` _(Array of Strings)_: Defines tags for the provider instance, which can be used afterwards to manage groups of providers [using the `providers` object](api-providers.md). _Origin addons should usually automatically add his own tag to the beggining of the provided array, to allow configuring easily all providers of a same type._

### Returns

A `provider` instance, which methods are described in the [providers and selectors methods](api-providers-and-selectors-methods.md) page of these docs.

### Example

```javascript
import { Axios } from "@data-provider/axios";

const provider = new Axios("example", {
  url: "/foo-url",
  tags: ["foo-tag"]
});

console.log(provider.id);
// example

console.log(provider.options);
// { cache: true, tags: ["axios", "foo-tag"], url: "/foo-url" }

```

### Tips

* Use clear identificators in your providers. It will improve the development experience, as Data Provider and addons usually use them when printing messages into the console.
* When an `id` is duplicated, Data Provider will automatically append a suffix to it and will print a warning.
