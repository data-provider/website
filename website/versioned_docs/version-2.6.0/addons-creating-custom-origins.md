---
id: version-2.6.0-addons-creating-custom-origins
title: How to create custom origins addons
sidebar_label: Creating custom origins
original_id: addons-creating-custom-origins
---

Data Provider is agnostic about data origins, so it can be used to read data from a REST API, from localStorage, or from any other origin. Custom addons are distributed for each different type of origin, and you can even create your owns.

In this guide we'll walk through the process of creating a simple "fetch" Data Provider origin able to perform Ajax requests, allowing to connect an application to a REST Api. The complete source code of the guide is in our [repository of examples][examples], and all used methods are described in the [Provider API](api-provider.md).

> During this chapter, we will create the addon as if we were going to publish it to NPM. So we will give also tips about how to define dependencies, add NPM tags, etc, if you are going to create your own origin inside your own project as an internal dependency without distributing it, simply skip those references.

## Add dependencies

Add @data-provider/core as a `peerDependency` to the `package.json` file:

```json
{
  "peerDependencies": {
    "@data-provider/core": "2.x"
  }
}
```

## Extending the Provider Class

To create a new origin type, you'll have to extend the [`Provider` Class](api-provider.md), which is the one providing all data-provider common features and methods.

```js
import { Provider } from "@data-provider/core";

export class Fetcher extends Provider {
  
}
```

[examples]: https://github.com/data-provider/examples

