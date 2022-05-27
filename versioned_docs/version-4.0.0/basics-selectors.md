---
id: basics-selectors
title: Selectors
sidebar_label: Selectors
---

## Defining selectors

A Selector combines providers or other selectors (what we call __`dependencies`__), and returns a new result.

Selectors have the same interface than providers, so views don't need to know if they are using a provider or a selector. Selectors can also be queried, and you can use the query value for querying the selector dependencies.

Whenever a dependency cache is clean, the selector cache will also be clean, and will be recalculated when it is read again.

> Defining dependencies for a Selector has a __very powerful API__. You could receive the results of one dependency and use it to query the next one, use functions to return different providers depending of the results of previous dependencies, read dependencies in parallel, etc. This example only shows the basics, please check the [Selector api](api-selector.md) to have an idea of everything you can do using selectors dependencies.

This means that, every data you need in a selector can be defined using its dependencies. It will care of retrieving all needed data, no matter how many providers are implied, and then parse, combine or transform the results into the expected format.

For those using the selector, they don't need to know where the data come from, and will have to handle an unique `loading` or `loaded` state, the one provided by the selector itself.

### Getting uncompleted todos

Let's define a selector for filtering todos in base of their `completed` status:

```javascript
import { Selector } from "@data-provider/core";

export const uncompletedTodos = new Selector(
  todos,
  (queryValue, todosResults) => todosResults.filter(todo => todo.completed === false)
);
```

That's all. Now, if we call to `uncompletedTodos.read()`, todos will be fetched from the server and filtered in client side, then returned to us. No matter how many times do you call to the read method, the selector dependencies will not be re-executed until the cache of the `todos` provider is cleaned. _(Or until the selector cache itself is cleaned. In that case, the last selector dependency declared as a function will be re-executed, but the todos will not be fetched from the server again, in case the cache of the provider has not been cleaned)_

## Source code

We will keep both providers and selectors in the same file for better comprehension of the example:

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

export const uncompletedTodos = new Selector(
  todos,
  (queryValues, todosResults) => todosResults.filter(todo => todo.completed === false)
);
```

## Extra: Handling selectors errors

In the case of any of the dependencies throws an error, the flow of reading the rest of selector dependencies will be stopped _(in case you have not defined a `catch` for the dependency)_, and you can handle the error in the `error` property of the selector state. Remember that the [`read` method of providers and selectors](api-providers-and-selectors-methods.md) returns a promise, so you could also handle errors using a standard promise `catch` method.
