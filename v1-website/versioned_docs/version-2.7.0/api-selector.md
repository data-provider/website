---
id: version-2.7.0-api-selector
title: Selector
original_id: api-selector
---

A Selector combines origins or other selectors (what we call __"dependencies"__), and returns a new result.

Selectors have the same interface than providers, so views don't need to know if they are using a provider or a selector. Selectors can also be queried, and you can use the query value for querying the selector dependencies, or in your `selector` function.

Whenever a dependency cache is cleaned, the selector cache will also be cleaned, and will be recalculated when it is read again.

## `Selector(...dependencies, selectorFunction, [options])`

### Arguments

* __`...dependencies`__ _(arguments)_: Dependencies can be defined in different ways. They can be providers, other selectors instances, functions returning other dependencies, an array of dependencies, or even `dependency objects`, which are objects with specific properties that allows to catch dependencies errors, etc. The full [dependencies API is described in the chapter bellow](#selector-dependencies).
* __`selectorFunction`__ _(Function)_: A function receiving the dependencies results, and the query applied to the selector in case it is queried. Read the [selector function API in the chapter bellow](#selector-function).
* __`options`__ _(Object)_: An object containing options for the selector, which properties can be:
	* __`id`__ _(String)_: Id for the provider instance. It is used internally as namespace in the store. It is also useful for debugging purposes.
	* __`initialState`__ _(Object)_: Object containing `loading`, `loaded`, `error` and `data` properties, which will define the initial state of the selector, before its `read` method is executed for the first time. This is useful to give a default value for the data, so you don't have to make extra format checks in your views _(`data && data.map`)_. It is also useful to define the initial loading state, which can be defined as true, which will save extra renders _(as the read method is executed normally by the views theirself, the first time a selector is read it should have `loading` state as false, then immediately `true`, then `false` when data is retrieved. Setting `initialState.loading` property to `true` will avoid that extra render in the initialization)._ A function can be also provided, then, it will receive the current `query` as argument, and the returned object will be used as `initialState`.
  * __`reRereadDependenciesMaxTime`__ _(Number)_: Milliseconds. The default behavior of the Selectors is to reread again a dependency if its cache is cleaned while the Selector is still reading another dependencies in order to provide always the last data available and not to lose any data update. This may produce a Selector never being resolved if a dependency cache is cleaned with a high frequency and dependencies take much time to be resolved. By default, Selectors will stop rereading dependencies after 5000ms. in order to avoid this possible issue. This time can be changed using this option.

### Returns

A `selector` instance, which methods are described in the [providers and selectors methods](api-providers-and-selectors-methods.md) page of these docs.

Apart of the common methods, selectors have also next getters:

* __`dependencies`__ _(Array)_ - Getter returning an array with the selector dependencies. Useful for testing purposes.
* __`selector`__ _(Function)_ - Getter returning the selector function, useful for testing purposes.

### Example

```javascript
import { Selector } from "@data-provider/core";

import { tasks } from "./providers"

export const completedTasks = new Selector(
  tasks, // dependency as provider instance
  tasksResults => tasksResults.filter(task => task.completed === false), // selector function
  { // options
    id: "completed-tasks",
    initialState: {
      loading: true,
      data: []
    }
  }
);

console.log(completedTasks.id);
// completed-tasks

console.log(completedTasks.state);
// { loading: true, data: [], loaded: false, error: null }

```

> This is a very basic example. Read [Selector dependencies section](#selector-dependencies) bellow for a more detailed explanation.

### Tips

* Use clear identifiers in your selectors. It will improve the development experience, as Data Provider and addons usually use them when printing messages into the console. If you do not provide one, Data Provider will assign one `uuid` automatically.
* When an `id` is duplicated, Data Provider will automatically append a suffix to it and will print a warning.
* Define always the `initialState`, it will save you extra format checks in your views, and will avoid an initial extra render, as described in the [Arguments API](#arguments).

<hr/>

## Selector function

The selector function receives the results of all provided dependencies, and the value of the selector query _(undefined if it is not queried)_. It is executed only the first time for each different query while the cache is valid.

The provided function should follow the next API:

#### `selectorFunction(...dependenciesResults, [query])`

##### Arguments

* __`dependenciesResults`__ _(arguments)_: Arguments containing the results of the selector dependencies, in the same order they were read. When dependencies are defined as an array, their results will be received in an array in a single argument in the correspondent position.
* __`query`__ _(Object)_: Object containing the value of the query applied to the selector _(`undefined` when it is not queried)_.

##### Returns

Can return any value, which with the `read` method will be resolved, and it will also be set in the `data` property of the selector state.

__It can also return another dependency__, defined in any of the formats described bellow. Then, the selector will be resolved with the value returned by the returned dependency.

> When a selector returns another dependency in its `selectorFunction`, its cache will also be cleaned when the cache of the returned dependency is cleaned.

```javascript
const tasksWithUserData = new Selector(
  // dependencies
  tasks,
  users,
  // selectorFunction
  (tasksResults, usersResults) => tasksResults.map(
    task => ({
      ...task,
      user: usersResults.find(user.id === task.user )
    })
  )
);
```

<hr/>

## Selector dependencies

Dependencies of selectors can be defined:

### As a provider or selector instance

Use directly other selectors or providers as dependencies of your selector. You can also query them.

```javascript
const tasksWithUserData = new Selector(
  tasks.query({ queryString: { completed: false }}), // dependency as queried provider instance
  users, // dependency as provider instance
  (tasksResults, usersResults) => tasksResults.map(
    task => ({
      ...task,
      user: usersResults.find(user.id === task.user )
    })
  )
);
```

### As a function returning a dependency

You can define a dependency as a function returning another dependency in any of the formats described in this chapter. This is very powerful, because you can apply different queries to your dependencies based on your own query value, or even based on the results of the previous dependencies, which makes the Selector very composable.

The provided function should follow the next API:

#### `dependency(query, previousResults)`

##### Arguments

1. __`query`__ _(Object)_: Object containing the value of the query applied to the selector _(`undefined` when it is not queried)_.
2. __`previousResults`__ _(Array)_: Array containing the results of the previous dependencies, in the same order they were read. When dependencies are defined as an array, their results will be received also as an array in the correspondent position.

##### Returns

Can return a dependency in any of the formats described in this chapter.

```javascript
const booksWithAuthorNameInTheTitle = new Selector(
  query => authors.query({ urlParam: { id: query.author }}),
  (query, previousResults) => books.query({ queryString: { title_contains: previousResults[0].name }}),
  (authorData, booksContainingAuthorNameInTheTitle) => booksContainingAuthorNameInTheTitle
);

booksWithAuthorNameInTheTitle.query({ author: 5 }).read();
// Will fetch /authors/5, then /books?title-contains=shakespeare, then return list of books
```

### As a `catchDependency` execution

You can define selector dependencies using the method `catchDependency` exported by the library. When used, dependencies errors will be catched and the provided `catch` method result will be returned instead.

#### `catchDependency(dependency, catchMethod)`

* __`dependency`__ _(selector dependency)_: A dependency defined in any of the formats described in this chapter.
* __`catchMethod`__ _(Function)_: Function that will be executed in case of the dependency is rejected with an error.

The provided `catchMethod` function should follow the next API:

#### `catchMethod(error, query, previousResults)`

##### Arguments

1. __`error`__ _(Error)_: Error causing the rejection of the dependency read method.
2. __`query`__ _(Object)_: Object containing the value of the query applied to the selector _(`undefined` when it is not queried)_.
3. __`previousResults`__ _(Array)_: Array containing the results of the previous dependencies, in the same order they were read. When dependencies are defined as an array, their results will be received also as an array in the correspondent position.

##### Returns

Can return any other dependency defined in any of the formats allowed. The returned dependency will be read, and the returned value by the failed one will be the value of this new one.

If you throw an error inside the catch function, or return a rejected Promise, then the dependency will be considered as errored, but with your error instead of with the original one.

```javascript
import { catchDependency } from "@data-provider/core";

const selector = new Selector(
  catchDependency(tasks, () => []), // returns an empty array when dependency tasks fail
  catchDependency(users, () => anotherUsersOrigin),// retrieve books from other origin when books fail
  (tasksResults, usersResults) => tasksResults
);
```

### As an array of dependencies

Defining dependencies as an array will result in reading them in parallel. Take into account that you will receive the results of the dependencies also inside an array:

```javascript
const selector = new Selector(
  [ // arrays of dependencies are read in parallel
    tasks,
    users
  ],
  ([tasksResults, usersResults]) => tasksResults.map(
    task => ({
      ...task,
      user: usersResults.find(user.id === task.user )
    })
  )
);
```

Arrays of dependencies are in fact dependencies, and accept any type of dependencies inside, so you could combine them in any of the formats described in this chapter:

```javascript
const selector = new Selector(
  books, // First read books
  [ // Then read tasks and authors in parallel
    tasks,
    query => authors.query(query)
  ],
  (booksResults, [tasksResults, usersResults]) => {
    // Do your stuff here
  }
);
```

### As a Promise

You can use a promise directly as a Selector dependency. Resolved value will be the result of the dependency, and it will be considered as errored in case the Promise is rejected. Take into account that Promises __can be used, but you should use them only in exceptional cases__, because one of the main features of the selectors, which is cleaning their own cache when any of the dependencies cache is cleaned obviously __will not work in case of native Promises__.

```javascript
const selector = new Selector(
  new Promise(resolve => {
    setTimeout(() => {
      resolve("foo");
    }, 3000);
  }), // Will wait 3 seconds before reading tasks
  tasks,
  (promiseResult, tasksResults) => {
    console.log(promiseResult);
    // foo
  }
);
```

### As any value

Any value? Yes, if you provide any other value, as a `String`, `Number`, `null`, `undefined`... the "dependency" will be resolved with that value.

This could seem an strange behavior, but in some scenarios you could want to "stop" the dependencies flow depending of the result of a previous dependency. In that case, you could use a dependency defined as a function, and decide to return another dependency, or directly some value, for example:

```javascript
const selector = new Selector(
  books,
  (query, previosResults) => {
    if (!previosResults.length) {
      return []; // There are no books, I don't mind the authors, return empty array.
    }
    return authors; // There are books. Let's read the "authors" provider.
  },
  (booksResults, authorsResults) => {
    return booksResults.map(book => {
      return {
        ...book,
        authorName: authorsResults.find(author => author.id === book.author)
      }
    });
  }
);
```


### Tips

* You can combine all described formats of dependencies as you want.
* The power of the dependencies API should allow you to retrieve all data you need using a single selector, but a better approach is to create one different selector for each level of granularity, so they can be used separately when needed. As they are composable, you can combine those selectors into another one, and so on... So, __better use selectors composition instead of defining lots of dependencies in a single selector__.

> You have more examples available about how to use selector dependencies in the [recipes page](recipes-index.md).

