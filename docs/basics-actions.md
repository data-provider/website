---
id: basics-actions
title: Actions
---

## Defining actions for providers

Data Provider does not concern about "actions", but normally, origins addons add its own methods for interacting with the data origin in different ways of "reading" the data, which is the main target of the library.

In this example we are going to see how to use the `update`, `create` and `delete` methods of the [@data-provider/axios addon][data-provider-axios], and how to, again, isolate the actions from the views, so they don't have to use directly the provider methods.

## Updating a todo

Let's add an action for updating todos. It will be a simple `Function` which will receive the `id` of the todo as first argument, and the new value of the `completed` property as second argument.

For updating a todo, we will use the `todo` provider, which corresponds to an specific todo "model". Querying it using the `urlParams` property will turn the url of the request into `/todos/[id]` _(read the [@data-provider/axios addon][data-provider-axios] docs for further info about how to use its queries)_

By default, the [@data-provider/axios addon][data-provider-axios] uses the PUT HTTP verb when the `update` method is used, but this behavior can be changed using the provider options, as we will see in the next chapter.

```javascript
const updateTodo = (id, completed) => {
  return todo.query({ urlParams: { id }}).update({
    completed
  });
};
```

> Note the usage of the `return` statement in the actions. As provider methods return promises, we also return it in our function.

## Deleting a todo

The `action` for deleting a todo is very similar to the one for updating it. It only differs in the provider method used. In this case, we will use the `delete` method, which by default uses the DELETE HTTP verb.

```javascript
const deleteTodo = id => {
  return todo.query({ urlParams: { id }}).delete();
};
```

## Creating todos

In this case we are going to use the `todos` provider, as "creating" is not related to an specific model, but to the entire "collection". We are going to create todos uncompleted by default.

By default, the [@data-provider/axios addon][data-provider-axios] uses the POST HTTP verb when the `create` method is used.

```javascript
const createTodo = text => {
  return todos.create({
    text,
    completed: false
  });
};
```

## Cleaning caches

Now we have defined all actions for adding, modifying or deleting todos, but take into account that __these actions are not modifying the `state` of the `todos` "collection".__ Data Provider is not concerned about modifying the local state for other actions than reading the `data` and handling the `loading` and `error` states.

The cache of each todo model is automatically cleaned after a successful `update` or `delete` method _(this is made by the [@data-provider/axios addon][data-provider-axios] addon)_, which will result in requesting the data again to the server when its `read` method is called again. Also, the `todos` provider cache will be cleaned after a successful `create` method. But, `todos` is not being informed when a `todo` is updated or deleted. Let's add some code to manually clean the the cache of `todos` to our actions:

```javascript
const updateTodo = (id, completed) => {
  return todo.query({ urlParams: { id }}).update({
    completed
  }).then(response => {
    todos.cleanCache(); // Clean "todos" cache when a todo is updated.
    return Promise.resolve(response);
  });
};
```

```javascript
const deleteTodo = id => {
  return todo.query({ urlParams: { id }})
    .delete()
    .then(response => {
      todos.cleanCache(); // Clean "todos" cache when a todo is deleted.
      return Promise.resolve(response);
    });
};
```

There is no need to add anything to the "create" action, as `todos` cache is automatically cleaned when a new `todo` is added, and each independent `todo` is not affected when a new `todo` is added.

> In our example we are going to use the [@data-provider/react addon][data-provider-react] for UI bindings, so cleaning the cache will be enough to automatically refresh the views. The addon is listening to "cleanCache" events, and when the cache of a provider is cleaned, it will automatically "read" the data again, so data will be requested again to the server, and only if any component related to that data is "alive" in that moment. These means that __you don't have to create a representation of the data from the server in client side and manually maintain it synchronized__, each portion of the data simply will be retrieved again each time it is needed, and only when it is being visualized.

### Another way of cleaning caches

We are cleaning the `todos` cache "manually" in our `todo` actions, but, what if our actions were not the unique method of updating or deleting a `todo`? Suposse one developer does not know about the existence of our actions, and uses directly the `todo.update` method from a view. Well, our `todos` collection will not be informed about a deletion, and that `todo` will be still visible in the `todos` list.

We can also use the Data Provider `eventEmitter` to declare relations between providers:

```javascript
todo.onChild("*", eventName => {
  if (eventName === "updateSuccess" || eventName === "deleteSuccess") {
    todos.cleanCache();
  }
});
```

The `onChild` method refers to listening events of any "children" (queried instances) of our provider (read the [events API chapter for further info](api-events.md). The axios addon emits `updateSuccess` and `deleteSuccess` errors when each method finish successfully. Then, we are cleaning the cache of `todos` every time a `todo` is updated or deleted, no matter if it was made using our actions or not.

In our example, as it is a very small project where things are very controlled, we are going to choose the first option, and we are going to manually clean the cache.

## Source code

In a real project you'll probably prefer to separate your actions to different files from your providers and selectors, and that's right, but in this guide we are going to define them in the same file for simplicity.

We have also defined a "cleanTodosCache" function to avoid code duplication in `updateTodo` and `deleteTodo` actions.

### `data/todos.js`

```javascript
import { Axios } from "@data-provider/axios";
import { Selector } from "@data-provider/core";

export const todos = new Axios("todos", {
  url: "/todos"
});

export const todo = new Axios("todo", {
  url: "/todo/:id"
});

export const todosFiltered = new Selector(
  todos,
  (todosResults, query) => {
    if (query.completed === null) {
      return todosResults;
    }
    return todosResults.filter(todo => todo.completed === query.completed)
  }
);

const cleanTodosCache = response => {
  todos.cleanCache();
  return Promise.resolve(response);
};

export const createTodo = text => {
  return todos.create({
    text,
    completed: false
  });
};

export const updateTodo = (id, completed) => {
  return todo.query({ urlParams: { id }})
    .update({ completed })
    .then(cleanTodosCache);
};

export const deleteTodo = id => {
  return todo.query({ urlParams: { id }})
    .delete()
    .then(cleanTodosCache);
};
```

[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios
[data-provider-react]: https://www.npmjs.com/package/@data-provider/react


