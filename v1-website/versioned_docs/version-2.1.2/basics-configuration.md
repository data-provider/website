---
id: version-2.1.2-basics-configuration
title: Configuration
original_id: basics-configuration
---

## Configuring providers

You'll have noticed that our providers `url` option only contains the url fragment, not the full url. This was made intentionally. We are delegating the configuration of the API `baseUrl` to another piece, normally closer to the application, which is able to read some configuration, as environment variables, etc.

Doing it in this way also allows to better reuse our providers, so we could even publish them to independent packages and reuse them across many applications, acting as "api clients".

### Using the `providers` object.

The Data Provider library give to us an utility for configuring groups of providers at a time (read the [providers API page](api-providers.md) for further info).

Let's use it to set the `baseUrl` option of all our providers of type `axios` (created using the [@data-provider/axios addon][data-provider-axios]).

```javascript
import { providers } from "@data-provider/core";

providers.getByTag("axios").config({
  baseUrl: "http://localhost:3100" // Here will be listening json-server
});
```

> The [@data-provider/axios addon][data-provider-axios] automatically adds the "axios" tag to all providers created.

The `providers.config` method __works for already instantiated providers, and also for providers instantiated in the future__, so it does not matter if we first import the `config.js` file, or the `data/todos.js` file. This is a very important detail, because the "app" does not need to know about specific providers, and the providers don't need to know about the base configuration, which boost the reusability. This is the reason why Data Provider gives to us a __"tag based configuration system"__.

## Source code

### `config.js`

```javascript
import { providers } from "@data-provider/core";

providers.getByTag("axios").config({
  baseUrl: "http://localhost:3100"
});
```

[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios
