---
id: addons-intro
title: Addons
sidebar_label: Intro
original_id: addons-intro
---

Addons provide a way to support and extend the behavior of Data Provider. [Edit this page in Github][edit-this-page] and open a PR to submit your own plugin.

> Looking for the API docs? Check out the [Provider API](api-provider.md) or the [Creating origin addons](addons-creating-origin-addons.md) chapter for writing an addon.

## Addon types

### Origins

Origin addons provide specific data origins implementations

#### [@data-provider/memory](https://github.com/data-provider/memory)

Allows reading objects stored in memory, allowing to use them as dependencies in Data Provider Selectors as any other type of origin. As an extra, it provides CRUD methods for modifying the object properties, and then, related caches are cleaned automatically.

#### [@data-provider/browser-storage](https://github.com/data-provider/browser-storage)

Allows reading objects saved in localStorage or sessionStorage, providing the "key" to access as Data provider id, and allowing to access different properties using Data Provider queries. As an extra, it provides CRUD methods for modifying the properties, and then, related caches are cleaned automatically.

#### [@data-provider/axios](https://github.com/data-provider/axios)

Allows reading data from REST APIs using [Axios](https://github.com/axios/axios) under the hood, and taking advantage of lots of its configuration options. As an extra, it provides CRUD methods for performing PUT, POST or PATCH requests on provider instances, and then, related caches are cleaned automatically.

#### [@data-provider/prismic](https://github.com/data-provider/prismic)

Allows reading data from Prismic CMS API. Under the hood, it uses the [prismic-javascript client](https://www.npmjs.com/package/prismic-javascript) to provide the Prismic data.

[edit-this-page]: https://github.com/data-provider/website/blob/master/docs/addons-intro.md

### UI Bindings

UI bindings provide a way to connect easily Data Provider origins and selectors with different UI Frameworks.

#### [@data-provider/react](https://github.com/data-provider/react)

Provides hooks and HOCs for easily connect React Components to the different properties of the state of the data providers (data, loading, loaded or error). It actively retrieves data from the provider, and refresh them each time the provider cache is cleaned.

[edit-this-page]: https://github.com/data-provider/website/blob/master/docs/addons-intro.md
