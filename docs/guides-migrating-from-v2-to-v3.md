---
id: guides-migrating-from-v2-to-v3
title: Migrating from v2 to v3
---

This doc guides you through migrating a project using Data Provider v2 to Data Provider v3.

Data Provider v3.0.0 introduced some [breaking changes](https://github.com/data-provider/core/releases/tag/v2.9.1) that require manual actions to complete a migration, but we published a version in Data Provider v2 that allows to perform a progressive migration. First, we will see all changes that have to be done, and afterwards we will give you some [__tips to achieve the migration progressively__](#how-to-migrate-progressively).

## Selectors dependencies arguments

### Why it was changed

In Data Provider v2 there was a clear differentiation between selector dependencies, and the last function provided to the selector, which was called the `selector` method itself, and it was required always when creating a Selector. It was the function receiving all the results of the dependencies, so you could parse, modify or combine its data and return the result.

So, this method was receiving the results of the dependencies as different arguments, in the same order than the dependencies were declared, and as last argument, it was receiving the `queryValue`, just in case you wanted to use it. On the contrary, the dependencies were receiving the `queryValue` as first argument, and the results of the previous dependencies inside an array in the second argument.

In later V2 minor releases, the `selector` method was allowed to return another dependencies as well (as the selector `dependencies` can do). And the dependencies were allowed to return also plain values (as the `selector` can do)

So, why not to unify the arguments of the `dependencies` and the `selector` method? In the end, the `selector` was already another type of `dependency`, able to do the same as a `dependency` was. Then, the concept of `selector` method was removed, and from v3, all arguments passed to the `Selector` class are considered as `dependencies`, except the last one in case it is a plain object, which remains being the selector options.

### What was changed

#### Arguments of the dependencies in a Selector

A Selector dependency in v1 was receiving next arguments:

`(queryValue, previousDependenciesResults) => {}`

Note that `previousDependenciesResults` was an array.

In v2 a Selector dependency receives next arguments:

`(queryValue, [...dependenciesResults]) => {}`

Where `dependenciesResults` are different arguments with the results of previous dependencies as well.

#### Arguments of the last function in a Selector

The last function of a Selector in v1 was receiving next arguments:

`([...dependenciesResults], queryValue) => {}`

In v2 the last function becomes another dependency, so it receives next arguments:

`(queryValue, [...dependenciesResults]) => {}`

So, in the last function in a Selector you have to move the `queryValue` argument from the last position (in case you were using it) to the first one.

#### v2 example

```javascript
const booksOfAuthor = new Selector(
  queryValue => author.query({ urlParams: { id: queryValue.id }}),
  (queryValue, previousResults) => books.query({
    queryString: { "author": previousResults[0].id }
  }),
  (authorResult, booksResults) => {
    return booksResults.map(book => ({
      ...book,
      authorName: authorResult.name,
    }));
  }
);
```

#### v3 example

```javascript
const booksOfAuthor = new Selector(
  queryValue => author.query({ urlParams: { id: queryValue.id }}),
  (queryValue, authorResult) => books.query({
    queryString: { "author": authorResult.id }
  }),
  (queryValue, authorResult, booksResults) => {
    return booksResults.map(book => ({
      ...book,
      authorName: authorResult.name,
    }));
  }
);
```

## Selectors options

### What was changed

#### `reReadDependenciesMaxTime` option

The `reReadDependenciesMaxTime` option in v2 was renamed to `readAgainMaxTime` in v3 for better comprehension.

#### v2 example

```javascript
selector.config({
  reReadDependenciesMaxTime: 3000,
});
```

#### v3 example

```javascript
selector.config({
  readAgainMaxTime: 3000,
});
```

## How to migrate progressively

### Install v2.10.0 version

The `@data-provider/core@2.10.0` version exposes both versions of the Selector class, so you can use the old API in some parts of your project while progressively migrate other parts to the new API.

```bash
npm i --save @data-provider/core@2.10.0
```

:::info
When you use the `Selector` class in this version you'll see a deprecation warning in the console, so you'll know you are ready to update to v3 when you stop receiving the warning.
:::

### Configure renamed option

The `reReadDependenciesMaxTime` option can be used only in selectors created with the old Class, while in the new ones only the `readAgainMaxTime` option will have effect. So, if you are using the `providers` handler to configure all selectors at a time, and you are using this option, now you'll have to set both options:

```javascript
providers.getByTag("selector").config({
  reReadDependenciesMaxTime: 3000,
  readAgainMaxTime: 3000,
});
```

### Use new Selector

Now you can use the new exported `SelectorV3` class in those selectors you want to start migrating:

```javascript
import { Selector, SelectorV3 } from "@data-provider/core";
```

Or, even better, if you plan to migrate one full file at a time, you could do:

```javascript
import { SelectorV3 as Selector } from "@data-provider/core";
```

:::info
Both selectors can be used as dependency of the other selector version, so they are fully compatible and the migration can be achieved progressively, migrating only those selectors you want.
:::

### Install v3.x version

Once you have migrated all your Selectors and you are not using any more the Selector v2, you could simply update your dependency to v3:

```bash
npm i --save @data-provider/core@3.x
```

And change your `SelectorV3` imports to `Selector` again:

```javascript
import { Selector } from "@data-provider/core";
```
