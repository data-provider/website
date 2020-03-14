---
id: recipes-querying-selectors
title: Querying selectors
---

Next examples assume assume you understand the topics in [basic tutorial](basics-intro.md) and you have read the [API section](api-reference.md). They also assume that you are familiarized with the syntax used when querying a provider created with the addon [@data-provider/axios][data-provider-axios].

## Filtering results in client side

When querying a selector, the `query` value is received the selector function, so, we can use it to filter the results of the selector dependencies:

```javascript
const booksTitleIncluding = new Selector(
  books,
  (booksResults, query) => booksResults.filter(book => book.title.includes(query.including))
);

booksTitleIncluding.query({ including: "Cervantes" }).read();
// Fetch to "/books", then returns books which title contains "Cervantes"
```

> We have named this example as "Filtering results in client side" only for better comprehension. This is true only in case that the selector dependency is an origin requesting to the server. If the dependency is an origin reading from `localStorage`, for example, the filtration will always be made in client side, no matter if you delegate the query to the dependency or not.

## Filtering results in server side

The `query` value can be used to query the selector dependencies, so we can also do:

```javascript
const booksTitleIncluding = new Selector(
  query => books.query({ queryString: { "title-including": query.including }}),
  booksResults => booksResults
);

booksTitleIncluding.query({ including: "Cervantes" }).read();
// Fetch to "/books?title-including=Cervantes", then returns result
```

But, why not to use the query method of the provider directly? We are not doing really nothing in the selector. This example makes sense when we add another property to the query:

```javascript
const booksTitleIncluding = new Selector(
  query => books.query({ queryString: { "title-including": query.including }}),
  (booksResults, query) => sortBooksResults(booksResults, query.sort)
);

booksTitleIncluding.query({ including: "Cervantes", sort: "desc" }).read();
// Fetch to "/books?title-including=Cervantes", then returns result desc. sorted.

booksTitleIncluding.query({ including: "Cervantes", sort: "asc" }).read();
// Does not fetch to "/books?title-including=Cervantes", as results were already cached.
// Returns results asc. sorted.
```

> As we have mention in the previous example, the title of this example is not exactly true, as server side or client side does not concern to Data Provider. This is only true when we are using an origin that requests to the server. The important thing here to is understand how can we pass the selector query to the dependencies.

## Filtering one dependency by the results of the previous one

When we define a selector dependency as a function, it will receive the value of the selector query, and the results of previous dependencies _(as described in the [Selector API page](api-selector.md))_.

Let's see how can we use that behavior in a real app:

```javascript
const booksTitleIncludingAuthorName = new Selector(
  query => author.query({ urlParams: { id: query.id }}),
  (query, previousResults) => books.query({
    queryString: { "title-including": previousResults[0].name }
  }),
  booksResults => booksResults
);

booksTitleIncludingAuthorName.query({ id: 1 }).read();
// Supossing that author with id 1 returns { name: "Cervantes" }:
// Fetch to "/authors/1", then to "books/?title-including=Cervantes"
// Return books result
```

[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios



