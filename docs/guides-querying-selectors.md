---
id: guides-querying-selectors
title: Querying selectors
---

Next examples assume assume you understand the topics in [basic tutorial](basics-intro.md) and you have read the [API section](api-reference.md). They also assume that you are familiarized with the syntax used when querying a provider created with the addon [@data-provider/axios][data-provider-axios].

:::info
Still using v2? Then you should read the [migrating from v2 to v3 guide](guides-migrating-from-v2-to-v3.md), as the Selector dependencies API was changed in v3.
:::

## Filtering results in client side

When querying a selector, the `queryValue` is received in the selector dependencies, so, we can use it to filter the results:

```javascript
const booksTitleIncluding = new Selector(
  books,
  (queryValue, booksResults) => booksResults.filter(book => book.title.includes(queryValue.including))
);

booksTitleIncluding.query({ including: "Cervantes" }).read();
// Fetch to "/books", then returns books which title contains "Cervantes"
```

> We have named this example as "Filtering results in client side" only for better comprehension. This is true only in case that the selector dependency is an origin requesting to the server. If the dependency is an origin reading from `localStorage`, for example, the filtration will always be made in client side, no matter if you delegate the query to the dependency or not.

## Filtering results in server side

The `queryValue` can be used to query the selector dependencies, so we can also do:

```javascript
const booksTitleIncluding = new Selector(
  queryValue => books.query({ queryString: { "title-including": queryValue.including }})
);

booksTitleIncluding.query({ including: "Cervantes" }).read();
// Fetch to "/books?title-including=Cervantes", then returns result
```

But, why not to use the query method of the provider directly? This example makes more sense when we add another property to the query:

```javascript
const booksTitleIncluding = new Selector(
  queryValue => books.query({ queryString: { "title-including": queryValue.including }}),
  (queryValue, booksResults) => sortBooksResults(booksResults, queryValue.sort)
);

booksTitleIncluding.query({ including: "Cervantes", sort: "desc" }).read();
// Fetch to "/books?title-including=Cervantes", then returns result desc. sorted.

booksTitleIncluding.query({ including: "Cervantes", sort: "asc" }).read();
// Does not fetch to "/books?title-including=Cervantes", as results were already cached.
// Returns results asc. sorted.
```

> As we have mention in the previous example, the title of this example is not exactly true, as server side or client side does not concern to Data Provider. This is only true when we are using an origin that requests to the server. The important thing here to is understand how can we pass the selector `queryValue` to the dependencies.

## Filtering one dependency by the results of the previous one

When we define a selector dependency as a function, it will receive the value of the current query, and the results of previous dependencies _(as described in the [Selector API page](api-selector.md))_.

Let's see how we can use this behavior in a real app:

```javascript
const booksTitleIncludingAuthorName = new Selector(
  queryValue => author.query({ urlParams: { id: queryValue.id }}),
  (queryValue, authorResult) => books.query({
    queryString: { "title-including": authorResult.name }
  }),
  (queryValue, authorResult, booksResults) => {
    return booksResults.map(book => ({
      ...book,
      authorName: authorResult.name,
    }));
  }
);

booksTitleIncludingAuthorName.query({ id: 1 }).read();
// Supossing that author with id 1 returns { name: "Cervantes" }:
// Fetch to "/authors/1", then to "books/?title-including=Cervantes"
// Return books results adding the author name to all of them
```

[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios



