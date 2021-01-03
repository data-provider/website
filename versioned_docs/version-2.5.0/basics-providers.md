---
id: basics-providers
title: Providers
sidebar_label: Providers
original_id: basics-providers
---

## Defining providers

A Provider defines an specific resource in data origin.

When we define a Provider, we'll get a provider instance that should be alive during the whole live of our application, as it is going to be at charge of the cache, avoiding unnecessary resource consumptions while the data origin has not changed.

Remember that providers are queryable, so you don't need to create a provider for each specific model, the approach is defining a provider for each different resource in the data origin. In the case of an API example, you should define a provider for each different API url.

## Using the Axios addon

Remember that Data Provider is not concerned about specific data origins. For this example, as we are going to retrieve todos from a REST API, we are going to use the [@data-provider/axios][data-provider-axios] addon.

First of all, install it:

```bash
npm i @data-provider/axios
```

> Keep in mind that this guide will talk only about the REST Api origin provided by [@data-provider/axios][data-provider-axios], but the concepts can be applied to any type of origin, as Data Provider is origin agnostic.

### Fetch todos from the API

Now we are going to define a provider for the todos collection and another one for the todo models.

* todos - Will fetch data from `/todos`
* todo - will fetch data from `/todos/:id`

_Why to add two different providers, one for the collection an one for the model? Well, even when the "todos" and the "todo" could seem to be the same "entity", the type of data returned by the API differs in both cases, and the queries that both origins will accept will be different too. So, for simplicity, we'll keep them as separated providers, and later we will [define a relation between them](basics-actions.md) in order to bind their caches lifecycle._

Arguments accepted by the `Axios` Class are:

* id - All Provider addons should receive an `id` as first argument _(useful for debugging purposes and for [configuring providers](basics-configuration.md))_.
* options - An options object is provided as second argument. Options will differ depending of the type of origin. In this case, we will define the `url` of the API. We do not define now the `baseUrl`, [this configuration](basics-configuration.md) is delegated to the main file of the application, avoiding coupling the providers to it, which improves its reusability.


```javascript
import { Axios } from "@data-provider/axios";

export const todos = new Axios("todos", {
  url: "/todos"
});
```

Now define another provider for retrieving specific todos. In this case, the `url` includes a parameter. The value of the parameter will be defined by the query value that we will pass to the provider when using it:

```javascript
export const todo = new Axios("todo", {
  url: "/todos/:id"
});
```

> Maybe you have noticed that using only the "todos" origin could be enough, as retrieving each todo from the server separately could not be necessary. We are doing it for better comprehension of the examples. Performance of the resultant application is not the target of this guide.

## Source code

We will maintain our data sources separated from the views, this is why this file is located under the `data` folder. This is not a requisite, you could organize the code of your application in any way, but it is strongly recommended.

### `data/todos.js`

```javascript
import { Axios } from "@data-provider/axios";

export const todos = new Axios("todos", {
  url: "/todos"
});

export const todo = new Axios("todo", {
  url: "/todos/:id"
});
```

[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios
