---
id: basics-queries
title: Queries
---

## Querying providers and selectors

Providers and selectors can be queried. Every time you use the `query` method of one of them, you will receive a new instance, with its own cache and methods (same instances will be returned for same query values).

Queried instances are __still related to parents__ in some way. Internally they are called "children", because when the cache of the "parent" resource is cleaned, all the children caches are cleaned too. _(For example, cleaning the cache of an API origin requesting to "/api/books", will also clean the cache of "/api/books?author=2")_

## Turning "uncompletedTodos" into a queryable selector

In the previous page, we created a selector called `uncompletedTodos`, but, what if you want to show also completed todos separately? Should you create a new selector for each different filter? Well, you could, but it is not the better approach. In this cases, the better approach can be to use the `query` method, as the function used to filter the results is the same for both cases, but changing the value of the `completed` property.

When we use the `query` method of a selector, we must provide an object as first argument. The value of the object will be received in the `selector` dependencies as first argument. Read the [Selector API page](api-selector.md) for further info.

We are also going to give to the selector an id, and an initial state. Doing it, we avoid extra work in our views to check the data format during the first render, before the data has been fetched. (The `data` property of the selector will contain an empty array from the initialization).

So, let's change the selector:

```javascript
export const todosFiltered = new Selector(
  todos,
  (queryValue, todosResults) => {
    if (queryValue.completed === null) {
      return todosResults;
    }
    return todosResults.filter(todo => todo.completed === query.completed)
  },
  {
    id: "todos-filtered",
    initialState: {
      data: []
    },
  }
);
```

Now, we can use the selector querying it:

```javascript
todosFiltered.read(); // Returns all todos
todosFiltered.query({ completed: false }).read(); // Returns not completed todos
todosFiltered.query({ completed: true }).read(); // Returns completed todos
```

In this example, we have decided to filter todos in the client side. The filter is executed by the selector dependency itself. In some scenarios in real projects you'll probably want to delegate the filtration to the server side. It can be easily done using a selector too, because the `queryValue` is also received in selector dependencies when they are defined as functions, so you could pass the selector `queryValue` to a query for the provider, which will change the `url` of the request. We will keep this guide as simple as possible for the moment. If you want to see more complex examples please visit the [querying selectors guide page](guides-querying-selectors.md).

## Source code

### `data/todos.js`

```javascript
import { Axios } from "@data-provider/axios";
import { Selector } from "@data-provider/core";

export const todos = new Axios({
  id: "todos",
  url: "/todos"
});

export const todo = new Axios({
  id: "todo",
  url: "/todos/:id"
});

export const todosFiltered = new Selector(
  todos,
  (queryValue, todosResults) => {
    if (queryValue.completed === null) {
      return todosResults;
    }
    return todosResults.filter(todo => todo.completed === query.completed)
  },
  {
    id: "todos-filtered",
    initialState: {
      data: []
    },
  }
);
```

## Extra: Queries are chainable

We are not going to use this feature in the guide, so you could skip this extra info if you want.

"Queries are chainable" means that you can use the `query` method of a provider or selector that was also created by the `query` method. The result will be a new provider which `query value` will be the extension of both queries.

```
const notCompleted = todos.query({queryString: {completed: false}});
const notCompletedDescSorted = notCompleted.query({queryString: {sort:"desc"}});

notCompletedDescSorted.read();
// Fetch to "/todos?completed=false&sort=desc"

notCompleted.cleanCache();
// Invalidates the caches of "notCompleted" and children ("notCompletedDescSorted")
```
