---
id: basics-queries
title: Queries
---

## Querying providers and selectors

Providers and selectors can be queried. Every time you use the `query` method of one of them, you will receive a new instance, with its own cache and methods (same instances will be returned for same query values).

Queried instances are __still related to parents__ in some way. Internally they are called "children", because when the cache of the "parent" resource is cleaned, all the children caches are cleaned too. _(For example, cleaning the cache of an API origin requesting to "/api/books", will also clean the cache of "/api/books?author=2")_

### Queries are chainable

This means that you can use the `query` method of a provider or selector that was created by a `query`. The result will be a new provider which `query value` will be the extension of both queries.

```
const notCompleted = tasks.query({queryString: {completed: false}});
const notCompletedDescSorted = notCompleted.query({queryString: {sort:"desc"}});

notCompletedDescSorted.read();
// Fetch to "/tasks?completed=false&sort=desc"

notCompleted.cleanCache();
// Invalidates the caches of "notCompleted" and children ("notCompletedDescSorted")
```

## Turning "uncompletedTasks" into a queryable selector

In the previous page, we created a selector called `uncompletedTasks`, but, what if you want to show also completed tasks separately? Should you create a new selector for each different filter? Well, you could, but it is not the better approach. In this cases, the better approach can be to use the `query` method, as the function used to filter the results is the same for both cases, only changing the value of the `completed` property.

When we use the `query` method of a selector, we must provide an object as first argument. The value of the object will be received in the `selector function` as last argument. Read the [Selector API page](api-selector.md) for further info.

So, let's change the selector:

```javascript
const tasksFilteredByCompleted = new Selector(
  tasks,
  (tasksResults, query) => tasksResults.filter(task => task.completed === query.completed)
);
```

Now, we can use the selector querying it:

```javascript
tasksFilteredByCompleted.query({ completed: false }).read(); // Returns not completed tasks
tasksFilteredByCompleted.query({ completed: true }).read(); // Returns completed tasks
```

In this example, we have decided to filter tasks in the client side. The filter is executed by the selector function itself. In some scenarios in real projects you'll probably want to delegate the filtration to the server side. It can be easily done using a selector too, because the `query` value is also received in selector dependencies when they are defined as functions, so you could convert the selector query into a query for the provider, which will change the `url` of the request. We will keep this guide as simple as possible for the moment. If you want to see more complex examples please visit the [querying selectors recipes page](recipes-querying-selectors.md).

## Source code

### `data/tasks.js`

```javascript
import { Axios } from "@data-provider/axios";
import { Selector } from "@data-provider/core";

export const tasks = new Axios("tasks", {
  url: "/tasks"
});

export const task = new Axios("task", {
  url: "/task/:id"
});

export const tasksFilteredByCompleted = new Selector(
  tasks,
  (tasksResults, query) => tasksResults.filter(task => task.completed === query.completed)
);
```



