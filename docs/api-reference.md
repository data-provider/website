---
id: api-reference
title: Api Reference
---

This section documents the complete Data Provider API. Keep in mind that Data Provider is not concerned about the views or about specific data origins. You'll also want to use UI bindings like [@data-provider/react][data-provider-react] and origins like [@data-provider/axios][data-provider-axios].

About origin addons, methods described here are common to all of them, but some can add its own methods and options, so please refer to its own documentation.

## Top-Level Exports

* [Provider](api-provider.md)
* [Selector](api-selector.md)
* [providers](api-providers.md)
* [storeManager](api-store-manager.md)

## Providers and selectors methods

Providers and selectors, once instantiated, have almost exactly the same methods:

* [Providers and selectors methods](api-providers-and-selectors-methods.md)

## Importing

Every function described above is a top-level export. You can import any of them like this:

### ES6

```javascript
import { Selector } from "@data-provider/core";
```

### ES5 (CommonJS)

```javascript
var Selector = require("@data-provider/core").Selector;
```

### ES5 (UMD)

```javascript
var Selector = dataProvider.Selector;
```

[data-provider-react]: https://www.npmjs.com/package/@data-provider/react
[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios
