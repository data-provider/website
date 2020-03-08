---
id: basics-example
title: Running the example
---

Now that we have all the code of our tiny todo app, we are going to create the "server" to which the application will request the todos.

## Install json-server

Install [json-server][json-server] from NPM:

```bash
npm i --save-dev json-server
```

## Add an script to start the server

Add the next script to your `package.json` to run the server:

```json
{
  "scripts": {
    "json-server": "json-server --watch db.json --port=3100"
  }
}
```

## Add the database

Create a `db.json` file at the root of the project, containing the initial database for the server, as well as the route that it has to use to serve the todos:

### `db.json`

```json
{
  "todos": [
    {
      "id": 1,
      "text": "Finish the basic tutorial",
      "completed": false
    }
  ]
}
```

## Start the server

```bash
npm run json-server
```

## Start the app

Now, while the server is running, start the app in another shell:

```bash
npm start
```

You can now use the [Redux devTools][redux-devtools] to inspect how the "data" states change while you add or modify todos. Open also the Network inspector, you'll notice how every time you modify a todo, all todos are requested again, so the todo list is always maintained up-to-date.

Notice also how all modifications or new todos are saved in the `db.json` file.

> The complete source code of the app built during this guide is in our [repository of examples][examples].

## Next steps

Now you know the basics, you should take some time to read through the [recipes](recipes-index.md) to get a better understanding of what Data Provider can really do for you in a real world project.

[json-server]: https://www.npmjs.com/package/json-server
[examples]: https://github.com/data-provider/examples
[redux-devtools]: https://github.com/reduxjs/redux-devtools
