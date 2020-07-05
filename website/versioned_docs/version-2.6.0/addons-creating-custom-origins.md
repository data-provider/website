---
id: version-2.6.0-addons-creating-custom-origins
title: How to create custom origins addons
sidebar_label: Creating custom origins
original_id: addons-creating-custom-origins
---

Data Provider is agnostic about data origins, so it can be used to read data from a REST API, from localStorage, or from any other origin. Custom addons are distributed for each different type of origin, and you can even create your owns.

> During this chapter, we will create a "fetch" Data Provider origin (able to perform Ajax requests) as if we were going to publish it to NPM. So we will give also tips about how to define dependencies, add NPM tags, etc, if you are going to create your own origin inside your own project as an internal dependency without distributing it, simply skip those references.

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
