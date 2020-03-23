---
id: basics-usage-with-react
title: Usage with React
---

From the very beginning, we need to stress that Data Provider has no relation to React. You can use Data Provider with React, Angular, Vue, jQuery, or vanilla JavaScript.

That said, for this example we are going to use the [@data-provider/react][data-provider-react] addon, which provides Data Provider UI bindings for React apps.

## Installing the React addon

React bindings are not included in Data Provider by default. You need to install them explicitly, as well as [react-redux][react-redux], which is a peer dependency of the addon:

```bash
npm i @data-provider/react react-redux
```

## Preface

This guide assumes that __you already know how to create and organize React components__. It also assumes that you have installed all needed dependencies to run a React app, have created the required files, as `public/index.html`, and have added the needed commands to your `package.json` file. If not, __you can do it easily using [Create React App][create-react-app]__ (if you do so, you can delete all contents inside the `src` folder after creating the application, as all needed files inside that folder are the one described in this guide).

The important point to understand here is that we are going to create "Presentational components", which don't have to know anything about Data Provider, and "Container Components" __(as they are called in the ["Redux - Usage with React" docs][redux-react])__, or "Modules", as I like to call them.

The app that we are building in this guide is highly inspired by the one built in the [Redux Basic Tutorial][redux-tutorial], this was made intentionally, as you can compare how the same application is built using Redux, and how using Data Provider. There are two main differences between both applications:

* In our example, we are going to keep the data in server side, instead of keeping it in the client side state.
* __We are not going to use Redux directly to handle the state of the current filter__. Data Provider usage can be combined without problem with Redux usage. But we want to limit this example to the usage of Data Provider, so the state of the `completed` filter is handled directly by the `TodoList.js` module, making it completely reusable. This also has another advantage: We could instantiate many times the `TodoList.js` module in the same application at the same time, each one filtering the todos in a different way.

So, for all referent about how to define the "Presentational components", how are they organized and why, we recommend you to read the ["Redux - Usage with React"][redux-react] page. There are differences in the way we are going to organize the components, but it can be a good reference. Here we are going to only show the sources, without further explanation, as it is not a Data Provider-specific task.

About what Redux docs call "Container Components", here we are going to call them "Modules" (even when the concept is almost exactly the same), and we are going to explain them in detail, as they are the pieces connected to the Data Provider.

## Presentational components

We also have to mention that __we are not going to worry about the performance of the example__. You'll see here some "React bad patterns" that should be avoided in a real app, as defining callbacks directly in the components props using arrow functions. But again, the purpose of this guide is not to learn about how to use React, so, we made this intentionally in favour of the examples simplicity.

### `components/Todo.js`

```javascript
import React from "react";
import PropTypes from "prop-types";

const Todo = ({ onClick, id, completed, text }) => (
  <li
    onClick={() => onClick(id, !completed)}
    style={{
      textDecoration: completed ? "line-through" : "none"
    }}
  >
    {text}
  </li>
);

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
};

export default Todo;
```

### `components/TodoList.js`

```javascript
import React from "react";
import PropTypes from "prop-types";
import Todo from "./Todo";

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos && todos.map((todo, index) => (
      <Todo key={index} {...todo} onClick={onTodoClick} />
    ))}
  </ul>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onTodoClick: PropTypes.func.isRequired
};

export default TodoList;
```

> Note the expression `todos && todos.map`. We are ensuring that `todos` have value before executing the `map` method. This can be easily avoided defining an `initialState` for the provider or selector. It has been omitted in this guide for simplicity, but it is highly recommended to define the `initialState` to avoid this type of extra checks in the views.

### `components/Button.js`

```javascript
import React from "react";
import PropTypes from "prop-types";

const Button = ({ active, children, onClick }) => {
  return (
    <button
      disabled={active}
      onClick={onClick}
    >
      {children}
    </button>
  )
};

Button.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Button;
```

### `components/Filters.js`

```javascript
import React from "react";

import Button from "./Button";

const Filters = ({ onClick, showCompleted }) => (
  <p>
    Show: <Button onClick={() => onClick(null)} active={showCompleted === null}>All</Button>
    {', '}
    <Button onClick={() => onClick(false)} active={showCompleted === false}>Active</Button>
    {', '}
    <Button onClick={() => onClick(true)} active={showCompleted === true}>Completed</Button>
  </p>
);

export default Filters;
```

### `components/AddTodo.js`

```javascript
import React from "react";

const AddTodo = ({ onSubmit }) => {
  let input;

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!input.value.trim()) {
            return
          }
          onSubmit(input.value)
          input.value = ''
        }}
      >
        <input
          ref={node => {
            input = node
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};

export default AddTodo;
```

## Modules

In the "modules" is where we are going to bind the presentational components to the data providers and actions. Note how these pieces could be reused easily in any other application, as they have clearly defined his dependency with the provider they are using.

### `modules/AddTodo.js`

Here, we simply render the `AddTodo.js` component, defining the `onSubmit` callback, which in our case will call to the `createTodo` action.

```javascript
import React from "react";

import { createTodo } from '../data/todos';
import AddTodoComponent from "../components/AddTodo";

const AddTodo = () => {
  return <AddTodoComponent onSubmit={text => createTodo(text)} />;
};

export default AddTodo;
```

### `modules/FilteredTodoList.js`

Here is where we are going to provide the `todos` data to the component at charge of rendering them. As input, this module will also receive the value of the current filter, so it can query the provider with the correspondant value.

To connect the provider, we will use the `useData` and `useLoading` methods of the [@data-provider/react][data-provider-react] package. These hooks bind the provider state to the component, so, when any of the chosen properties changes (`data` and `loading` in this case), the component will be re-rendered. The hooks also will dispatch the `read` method of the provider the first time the component is rendered, and will dispatch it again every time its cache is cleaned, so the view will be maintained up to date with the latest data from the provider (and from the server, in this case).

```javascript
import React from "react";
import { useData, useLoading } from "@data-provider/react";

import { todosFiltered, updateTodo } from "../data/todos";
import TodoList from "../components/TodoList";

const FilteredTodoList = ({ showCompleted }) => {
  const todosProvider = todosFiltered.query({ completed: showCompleted });
  const todos = useData(todosProvider);
  const loading = useLoading(todosProvider);

  if (loading && !todos) {
    return <div>Loading...</div>;
  }
  return (
    <TodoList todos={todos} onTodoClick={updateTodo} />
  );
};

export default FilteredTodoList;
```

> Note the expression `(loading && !todos)` that we are using to handle the loading state. Data Provider inform to us when the `todos` are being loadded, but we don't want to show the "loading..." indicator every time data is loading. It will be shown only the first time the data is being loaded, while `todos` collection is empty. Rest of times, the current todos state will be shown until the `todos` are fetched again, and then replaced. In this way we __avoid unwanted flickerings__ in the UI.

### `modules/TodoList.js`

In this component we are going to handle the state of the `completed` filter and render both filter and filtered list modules.

```javascript
import React, { useState } from "react";

import Filters from "../components/Filters";
import FilteredTodoList from "./FilteredTodoList";

const TodoList = ({ showCompletedByDefault }) => {
  const [showCompleted, setShowCompleted] = useState(showCompletedByDefault);

  return (
    <div>
      <FilteredTodoList showCompleted={showCompleted} />
      <Filters
        onClick={show => setShowCompleted(show)}
        showCompleted={showCompleted}
      />
    </div>
  );
};

export default TodoList;
```

## App

We are going to create a separated folder for the "app", which will contain the component rendering the main "layout" and the file at charge of configuring the providers.

### `app/App.js`

```javascript
import React from "react";

import AddTodo from "../modules/AddTodo";
import TodoList from "../modules/TodoList";

const App = () => {
  return (
    <div>
      <AddTodo />
      <TodoList showCompletedByDefault={false} />
      <TodoList showCompletedByDefault={true} />
    </div>
  );
};

export default App;
```

> We are rendering twice the `TodoList` module intentionally in order to show how both can live together at the same time, and both will react to the changes in the providers. One will show the uncompleted todos by default, and the other one the completed ones, but you can set the filter of each one without affecting the another.

## Migrating the store

Data Provide [React addon][data-provider-react] uses [react-redux][react-redux] to provide Redux bindings for React, so components need access to the Redux store. To do so, we are going to use the React Redux `Provider`, and we are also going to "migrate" the Data Provider store to the store of our app using the Data Provide `storeManager`.

We define a namespace for the Data Provider store, and use Redux `combineReducers` to migrate it to our app store, in this way, we could define our own application reducers without any conflict. After this, we use the Data Provider `storeManager` to set our app store as the Data Provider store, indicating to it the namespace to use. Read the [storeManager API](api-store-manager.md) for further info.

### `index.js`

```javascript
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { storeManager } from "@data-provider/core";

import "./app/config";
import App from "./app/App";

const DATA_PROVIDER_STORE = "data";

const store = createStore(
  combineReducers({
    [DATA_PROVIDER_STORE]: storeManager.reducer
  }),
  window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

storeManager.setStore(store, DATA_PROVIDER_STORE);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

> Here we are also importing the `app/config.js` file created during the configuration chapter of this guide in order to configure the providers.

[create-react-app]: https://github.com/facebook/create-react-app
[data-provider-react]: https://www.npmjs.com/package/@data-provider/react
[redux-react]: https://redux.js.org/basics/usage-with-react
[redux-tutorial]: https://redux.js.org/basics/basic-tutorial
[react-redux]: https://react-redux.js.org/
