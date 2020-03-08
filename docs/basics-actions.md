---
id: basics-actions
title: Actions
---

## Defining actions for providers

Data Provider does not concern about "actions", but normally, origins addons add its own methods for interacting with the data origin in different ways of "reading" the data, which is the main target of the library.

In this example we are going to see how to use the `update`, `create` and `delete` methods of the [@data-provider/axios addon][data-provider-axios], and how to, again, isolate the actions from the views, so they don't have to use directly the provider methods.

## Updating a task

Let's add an action for updating tasks. It will be a simple `Function` which will receive the `id` of the task as first argument, and the data to be modified as second argument.

For updating a task, we will use the `task` provider, which corresponds to an specific task "model". Querying it using the `urlParams` property will turn the url of the request into `/tasks/[id]` _(read the [@data-provider/axios addon][data-provider-axios] docs for further info about how to use its queries)_

By default, the [@data-provider/axios addon][data-provider-axios] uses the PUT HTTP verb when the `update` method is used, but this behavior can be changed using the provider options, as we will see in the next chapter.

```javascript
const updateTask = (id, data) => {
  return task.query({ urlParams: { id }}).update(data);
};
```

> Note the usage of the `return` statement in the "action". As provider methods return promises, we also return it in our function.

## Deleting a task

The `action` for deleting a task is very similar to the one for updating it. It only differs in the provider method used. In this case, we will use the `delete` method, which by default uses the DELETE HTTP verb.

```javascript
const deleteTask = id => {
  return task.query({ urlParams: { id }}).delete();
};
```

## Creating tasks

In this case we are going to use the `tasks` provider, as "creating" is not related to an specific model, but to the entire "collection".

By default, the [@data-provider/axios addon][data-provider-axios] uses the POST HTTP verb when the `create` method is used.

```javascript
const createTask = data => {
  return tasks.create(data);
};
```

## Cleaning caches

Now we have defined all actions for adding, modifying or deleting tasks, but take into account that __these actions are not modifying the `state` of the `tasks` "collection".__ Data Provider is not concerned about modifying the local state for other actions than reading the `data` and handling the `loading` and `error` states.

The cache of each task model is automatically cleaned after a successful `update` or `delete` method _(this is made by the [@data-provider/axios addon][data-provider-axios] addon)_, which will result in requesting the data again to the server when its `read` method is called again. Also, the `tasks` provider cache will be cleaned after a successful `create` method. But, `tasks` is not being informed when a `task` is updated or deleted. Let's add some code to manually clean the the cache of `tasks` to our actions:

```javascript
const updateTask = (id, data) => {
  return task.query({ urlParams: { id }})
    .update(data)
    .then(response => {
      tasks.cleanCache(); // Clean "tasks" cache when a task is updated.
      return Promise.resolve(response);
    });
};
```

```javascript
const deleteTask = id => {
  return task.query({ urlParams: { id }})
    .delete()
    .then(response => {
      tasks.cleanCache(); // Clean "tasks" cache when a task is deleted.
      return Promise.resolve(response);
    });
};
```

There is no need to add anything to the "create" action, as `tasks` cache is automatically cleaned when a new task is added, and each independent `task` is not affected when a new task is added.

> In our example we are going to use the [@data-provider/react addon][data-provider-react] for UI bindings, so cleaning the cache will be enough to automatically refresh the views. The addon is listening to "cleanCache" events, and when the cache of a provider is cleaned, it will automatically "read" the data again, so data will be requested again to the server, and only if any component related to that data is "alive" in that moment. These means that __you don't have to create a representation of the data from the server in client side and manually maintain it synchronized__, each portion of the data simply will be retrieved again each time it is needed, and only when it is being visualized.

### Another way of cleaning caches

We are cleaning the `tasks` cache "manually" in our `task` actions, but, what if our actions were not the unique method of updating or deleting a task? Suposse one developer does not know about the existence of our actions, and uses directly the `task.update` method from a view. Well, our `tasks` collection will not be informed about a deletion, and that task will be still visible in the "tasks" list.

We can also use the Data Provider `eventEmitter` to declare relations between providers:

```javascript
task.onChild("*", eventName => {
  if (eventName === "updateSuccess" || eventName === "deleteSuccess") {
    tasks.cleanCache();
  }
});
```

The `onChild` method refers to listening events of any "children" (queried instances) of our provider (read the [events API chapter for further info](api-events.md). The axios addon emits `updateSuccess` and `deleteSuccess` errors when each method finish successfully. Then, we are cleaning the cache of `tasks` every time a `task` is updated or deleted, no matter if it was made using our actions or not.

In our example, as it is a very small project when things are very controlled, we are going to choose the first option, and we are going to manually clean the cache.

## Source code

In a real project you'll probably prefer to separate your actions to different files from your providers and selectors, and that's right, but in this guide we are going to define them in the same file for simplicity.

We have also defined a "cleanTasksCache" function to avoid code duplication id `updateTask` and `deleteTask` actions.

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

const cleanTasksCache = response => {
  tasks.cleanCache();
  return Promise.resolve(response);
};

export const updateTask = (id, data) => {
  return task.query({ urlParams: { id }})
    .update(data)
    .then(cleanTasksCache);
};

export const deleteTask = id => {
  return task.query({ urlParams: { id }})
    .delete()
    .then(cleanTasksCache);
};
```

[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios
[data-provider-react]: https://www.npmjs.com/package/@data-provider/react


