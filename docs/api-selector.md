---
id: api-selector
title: Selector
---

A Selector combines providers or other selectors (what we call __"dependencies"__), and returns a new result.

Selectors have the same interface than providers, so views don't need to know if they are using a provider or a selector. Selectors can also be queried, and you can use the query value inside the selector dependencies.

Whenever a dependency cache is cleaned, the selector cache will also be cleaned, and will be recalculated when it is read again.

:::info
Still using v2? The you should read the [migrating from v2 to v3 guide](guides-migrating-from-v2-to-v3.md), as the Selector dependencies API was changed in v3.
:::

## `Selector(...dependencies, [options])`

### Arguments

* __`...dependencies`__ _(arguments)_: Dependencies can be defined in different ways. They can be providers, other selectors instances, functions returning other dependencies, promises, an array of dependencies, a `catchDependency` method, which are special methods that allows to catch dependencies errors, etc. The full [dependencies API is described in the chapter bellow](#selector-dependencies).
* __`options`__ _(Object)_: An object containing options for the selector, whose properties can be:
	* __`id`__ _(String)_: Id for the provider instance. It is used internally as namespace in the store. It is also useful for debugging purposes.
	* __`initialState`__ _(Object)_: Object containing `loading`, `loaded`, `error` and `data` properties, which will define the initial state of the selector, before its `read` method is executed for the first time. This is useful to give a default value for the data, so you don't have to make extra format checks in your views _(`data && data.map`)_. It is also useful to define the initial loading state, which can be defined as true, which will save extra renders _(as the read method is executed normally by the views theirself, the first time a selector is read it should have `loading` state as false, then immediately `true`, then `false` when data is retrieved. Setting `initialState.loading` property to `true` will avoid that extra render in the initialization)._ A function can be also provided, then, it will receive the current `queryValue` as argument, and the returned object will be used as `initialState`.
  * __`cleanCacheThrottle`__ _(Number)_: Milliseconds. Avoids cleaning the cache more than once during this period of time. If the `cleanCache` or `cleanDependenciesCache` methods are called one or multiple times while they are "throttled", it will clean the cache again when the period expires. This option will be ignored if clean cache methods are called with the option `{ force: true}`. Setting this option to null will remove previously defined value. This option can be changed also using the config method of the selector instance.
  * __`readAgainMaxTime`__ _(Number)_: Milliseconds. The default behavior of the Selectors is to read again a dependency if its cache is cleaned while the Selector is still reading another dependencies in order to provide always the last data available and not to lose any data update. This may produce a Selector never being resolved if a dependency cache is cleaned with a high frequency and dependencies take much time to be resolved. By default, Selectors will stop rereading dependencies after 5000ms. in order to avoid this possible issue. This time can be changed using this option.

### Returns

A `selector` instance, which methods are described in the [providers and selectors methods](api-providers-and-selectors-methods.md) page of these docs.

Apart of the common methods, selectors have also next getter:

* __`dependencies`__ _(Array)_ - Getter returning an array with the selector dependencies. Useful for testing purposes.

### Example

```javascript
import { Selector } from "@data-provider/core";

import { tasks } from "./providers"

export const completedTasks = new Selector(
  tasks, // dependency as a provider instance
  (queryValue, tasksResults) => tasksResults.filter(task => task.completed === false), // dependency as a function
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

## Selector dependencies

Dependencies of selectors can be defined:

### As a provider or selector instance

Use directly other selectors or providers as dependencies of your selector. You can also query them.

```javascript
const tasksWithUserData = new Selector(
  tasks.query({ queryString: { completed: false }}), // dependency as queried provider instance
  users, // dependency as provider instance
  (queryValue, tasksResults, usersResults) => tasksResults.map(
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

#### `dependency(queryValue, [...previousDependenciesResults])`

##### Arguments

1. __`queryValue`__ _(Object)_: Object containing the value of the query applied to the selector _(`undefined` when it is not queried)_.
2. __`previousDependenciesResults`__ _(Arguments)_: Arguments containing the results of the previous dependencies, in the same order they were read. When dependencies are defined as an array, their results will be received also as an array in the correspondent position.

##### Returns

Can return a dependency in any of the formats described in this chapter, or a plain value.

```javascript
const booksWithAuthorNameInTheTitle = new Selector(
  queryValue => authors.query({ urlParam: { id: queryValue.author }}),
  (queryValue, authorData) => books.query({ queryString: { title_contains: authorData.name }}),
  (queryValue, authorData, booksContainingAuthorNameInTheTitle) => booksContainingAuthorNameInTheTitle
);

booksWithAuthorNameInTheTitle.query({ author: 5 }).read();
// Will fetch /authors/5, then /books?title-contains=shakespeare, then return list of books
```

### As a `catchDependency` method

You can define selector dependencies using the method `catchDependency` exported by the library. When used, dependencies errors will be catched and the provided `catch` method result will be returned instead.

#### `catchDependency(dependency, catchMethod)`

* __`dependency`__ _(selector dependency)_: A dependency defined in any of the formats described in this chapter.
* __`catchMethod`__ _(Function)_: Function that will be executed in case of the dependency is rejected with an error.

The provided `catchMethod` function should follow the next API:

#### `catchMethod(error, queryValue, [...previousDependenciesResults])`

##### Arguments

1. __`error`__ _(Error)_: Error causing the rejection of the dependency read method.
2. __`queryValue`__ _(Object)_: Object containing the value of the query applied to the selector _(`undefined` when it is not queried)_.
3. __`previousDependenciesResults`__ _(Arguments)_: Arguments containing the results of the previous dependencies, in the same order they were read. When dependencies are defined as an array, their results will be received also as an array in the correspondent position.

##### Returns

Can return any other dependency defined in any of the formats described in this chapter.

If you throw an error inside the catch function, or return a rejected Promise, then the dependency will be considered as errored, but with your error instead of with the original one.

```javascript
import { catchDependency } from "@data-provider/core";

const selector = new Selector(
  catchDependency(tasks, () => []), // returns an empty array when dependency tasks fail
  catchDependency(users, () => anotherUsersOrigin),// retrieve users from other origin when users fails
  (queryValue, tasksResults, usersResults) => tasksResults
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
  (queryValue, [tasksResults, usersResults]) => tasksResults.map(
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
    queryValue => authors.query(queryValue)
  ],
  (queryValue, booksResults, [tasksResults, usersResults]) => {
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
  (queryValue, promiseResult, tasksResults) => {
    console.log(promiseResult);
    // foo
  }
);
```

### As a Promise returning a dependency

Promises can also return another dependency. Then, the received result will be the result returned by the dependency, and, in this case, if the dependency is a provider, the selector cache will also be cleaned when the dependency cache is cleaned.

```javascript
const selector = new Selector(
  (queryValue) => {
    return somePromise(queryValue)
      .then(() => tasksProvider.query({ resolved: true }))
      .catch(() => tasksProvider.query({ resolved: false }))
  },
  (queryValue, tasksResults) => {
    console.log(tasksResults);
    return tasksResults;
  }
);
```

### As any value

Any value? Yes, if you provide any other value, as a `String`, `Number`, `null`, `undefined`... the "dependency" will be resolved with that value.

```javascript
const selector = new Selector(
  books,
  (queryValue, booksResults) => {
    if (!booksResults.length) {
      return []; // There are no books, I don't mind the authors, return empty array.
    }
    return authors; // There are books. Let's read the "authors" provider.
  },
  (queryValue, booksResults, authorsResults) => {
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

> You have more examples available about how to use selector dependencies in the [guides page](guides-index.md).

