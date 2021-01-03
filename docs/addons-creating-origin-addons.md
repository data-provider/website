---
id: addons-creating-origin-addons
title: How to create origin addons
sidebar_label: Creating origin addons
---

Data Provider is agnostic about data origins, so it can be used to read data from a REST API, from `localStorage`, or from any other origin. Custom addons are distributed for each different type of origin, and you can even create your owns.

In this guide we'll walk through the process of creating a simple "fetch" Data Provider origin able to perform Ajax requests, allowing to connect an application to a REST Api. The complete source code of the guide is in our [repository of examples][examples], and all used methods are described in the [Provider API](api-provider.md).

## Extending the Provider Class

To create a new origin type, you'll have to extend the [`Provider` Class](api-provider.md), which is the one providing all data-provider common features and methods.

```js
import { Provider } from "@data-provider/core";

export class Fetcher extends Provider {
  
}
```

## Options

Our addon will accept a `baseUrl` option, which will be defined when instantiating the Provider, and the rest of the url will be defined as a `query` parameter. So, every different "queried" instance (every different url) will have its own cache, (it will still be possible to clean all caches calling to the `parent` instance `cleanCache` method).

It is a very simple scenario, but it will be useful to illustrate the example. If you want to use a more complex `data-provider` origin to connect an application to a REST API and handle a lot of possible complex scenarios take a look at the [Axios addon][axios].

Define a `configMethod` in the Class. It will receive the options when initialized and also when the `config` method is called, so the `baseUrl` could be also changed after initializing it.
Store the `baseUrl` option in an internal property of the class.

```js
import { Provider } from "@data-provider/core";

export class Fetcher extends Provider {
  configMethod(options) {
    this._baseUrl = options.baseUrl;
  }
}
```

## Tags

In order to allow users to select all instances of our new addon at the same time using the [`providers` handler](api-providers.md), we will add a base tag to it. Users will still be able to add its own tags to the addon instances using options, but all of them will have the base tags too. For this purpose we will add a `baseTags` getter returning the tag/tags.

```js
import { Provider } from "@data-provider/core";

export class Fetcher extends Provider {
  configMethod(options) {
    this._baseUrl = options.baseUrl;
  }

  get baseTags() {
    return ["api", "fetcher"];
  }
}
```

## Read method

Now we will define the `readMethod` of our origin, which will use the `cross-fetch` library under the hood. We will use the `this.queryValue` to obtain the rest of the url in case the provider is queried. The method also checks the response status code, treating it as an error if it is upper or equal than 400, and converts the response to a json, which will be the value stored in the state `data` property.

Errors will be handled automatically by data-provider, its value will be stored in the `error` property of the state, and the cache will be invalidated.

```js
import { Provider } from "@data-provider/core";
import fetch from "cross-fetch";

export default class Fetcher extends Provider {
  configMethod(options) {
    this._baseUrl = options.baseUrl;
  }

  get baseTags() {
    return ["api", "fetcher"];
  }

  readMethod() {
    return fetch(`${this._baseUrl}${this.queryValue.url || ""}`).then((res) => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.json();
    });
  }
}
```

__And that's all!__  Now you have a custom origin reading data from a REST API, and you could use it as in the next examples 😊

> After next examples we will add more methods to the addon, and give some tips about how to publish it to NPM.

## Using the addon

Instantiate the origin, giving to it an id to make easier the identification of the different providers states in case you have to debug it.
Define also the `baseUrl` option, and an empty array as initial state, so it will be the value of the data state while the real data has not been loaded.

```js
import Fetcher from "./Fetcher";

export const jsonPlaceHolderApi = new Fetcher("json-placeholder-api", {
  baseUrl: "https://jsonplaceholder.typicode.com/",
  initialState: {
    data: [],
  },
});
```

Now you can use it directly with promises using the `read` method:

```js
import { jsonPlaceHolderApi } from "./providers";

const runExample = async () => {
  // read posts
  const posts = await jsonPlaceHolderApi.query({ url: "posts" }).read();
  console.log(posts);

  // read posts again. Fectch is not executed again, as the response is cached
  await jsonPlaceHolderApi.query({ url: "posts" }).read();

  // read posts
  const users = await jsonPlaceHolderApi.query({ url: "users" }).read();
  console.log(users);
};

runExample();
```

And you can use it in a React project using the `react` addon, for example:

```jsx
import { jsonPlaceHolderApi } from "./providers";
import { useData } from "@data-provider/react";

export const Posts = () => {
  // read posts
  const posts = useData(jsonPlaceHolderApi.query({ url: "posts" }));

  return (
    <div>
      <h1>POSTS</h1>
      <ul>
        {posts.map(post => <Post post={post} key={`post-${post.id}`}/>)}
      </ul>
    </div>
  )
};
```

> Read the ["Usage with React" chapter of the Basic Tutorial](basics-usage-with-react.md) to learn more about how to use the data-provider React addon.

## Using the addon with Selectors

Every data-provider origin addon can be used as a dependency of [data-provider Selectors](api-selector.md), so you can combine the results of two different queries, for example, or combine two different origin instances, or two different addons, etc. You can read the [Selectors recipes chapter](recipes-querying-selectors.md) to get a reference about the power of using Selectors.

Create one selector that will return one post, including the name and email of the user who created it. As query parameter the selector will receive the id of the post.

```js
import { Selector } from "@data-provider/core";
import { jsonPlaceHolderApi } from "./providers";

export const postWithUserData = new Selector(
  (query) => jsonPlaceHolderApi.query({ url: `posts/${query.id}` }),
  (query, previousResults) =>
    jsonPlaceHolderApi.query({ url: `users/${previousResults[0].userId}` }),
  (postData, userData) => {
    return {
      ...postData,
      userName: userData.name,
      userEmail: userData.email,
    };
  },
  {
    id: "post-with-user-data",
  }
);
```

Now you can use the selector directly, and it will fetch all needed data:

```jsx
import { postWithUserData } from "./selectors";
import { useData, useLoaded } from "@data-provider/react";

export const Post = ({ id }) => {
  const provider = postWithUserData.query({ id });
  const data = useData(provider);
  const loaded = useLoaded(provider);

  return (
    <div>
      <h1>POST {id}</h1>
      {!loaded && <div>Loading...</div>}
      {loaded && (
        <div>
          <p>Author: {post.userName}</p>
          <p>Email: {post.userEmail}</p>
          <p>Title: {post.title}</p>
          <p>Body: {post.body}</p>
        </div>
      )}
    </div>
  )
};
```

This is only an example in which two API calls are executed when the Post component is rendered. Different behaviors could be achieved simply creating different Selectors, for example one selector reading all posts and users data and filtering or combining them in client side, etc.

> Read the [Selectors API chapter](api-selector.md) for further info about data-provider Selectors.

## Custom methods

For the moment our addon only can perform GET requests to the API, so let's add some methods to it to allow updating a resource.
Our method will send a PATCH request and will clean the cache of the resource when it receives a success response.

```js
export class Fetcher extends Provider {
  //...

  update(data) {
    return fetch(`${this._baseUrl}${this.queryValue.url || ""}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      this.cleanCache();
      return res.json();
    });
  }
}
```

Now you could use this new method in the same way than the `read` one:

```js
import { jsonPlaceHolderApi } from "./providers";

const runExample = async () => {
  // update one post
  const result = await jsonPlaceHolderApi.query({ url: "posts/1" }).update({
    title: "Foo new title",
  });

  // Result in this example will be the same as jsonPlaceholderApi does not persist modifications
  console.log(result);
};

runExample();
```

As we have cleaned the cache of the provider after the request, the read method will execute a new request when it is called again, and it will also emit an event, so, if you are using the "react" addon, for example, all of the connected views to the `jsonPlaceHolderApi.query("posts/1")` resource will be refreshed automatically with the new data from the server.

## Go further

Apart of defining custom methods, you could also use arguments in the read method or other custom methods to set the request headers or other `fetch` options, etc. It will depend of the addon purpose, the type of the origin, and lots of other details if it is better to use configuration, arguments, custom methods, etc. Remember to read the [Provider API](api-provider.md) chapter to get further information about all of the possibilities.

## Publish to NPM

If you are going to publish your addon to NPM, you should follow some tips:

* Add @data-provider/core as a `peerDependency` to the `package.json` file:

```json
{
  //...
  "peerDependencies": {
    "@data-provider/core": "2.x"
  }
}
```

* Add at least next keywords to make easier to find your addon to other users:

```json
{
  //...
  "keywords": [
    "data-provider",
    "addon",
    "origin"
  ]
}
```

* We recommend to use [Rollup](https://github.com/rollup/rollup) to bundle the package in CJS, ESM and UMD formats at least, defining each different entry point in the `package.json`:

```json
{
  //...
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js"
}
```

[examples]: https://github.com/data-provider/examples
[axios]: https://github.com/data-provider/axios