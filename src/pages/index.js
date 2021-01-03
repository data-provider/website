import React from "react";
import Layout from "@theme/Layout";
import CodeBlock from "@theme/CodeBlock";
import GitHubButton from "react-github-btn";
import Head from "@docusaurus/Head";

import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import useText from "@theme/custom-hooks/useText";

const textContents = {
  benefits_01: `
    Optimized. Don't care about how many times do you call simultaneously to read a provider.
  `,
  benefits_02: `
    Handling asynchronies implies handling error and loading states. Data Provider makes this job for you.
  `,
  benefits_03: `
    Compute data derived from other Providers or Selectors with a [familiar and very powerful syntax](docs/api-selector).
  `,
  uiBindings: `
    Data Provider is not concerned about the views, but [UI binding addons](docs/addons-intro) are available.
    <br/><br/>
    The <a href="https://github.com/data-provider/react" rel="noopener noreferrer">@data-provider/react package</a> <b>gives you hooks to easily retrieve and provide data</b> and other data-provider states to React components.
    It also provides <b>HOCs</b> like <code>withData</code>, <code>withLoading</code>, etc.
    <br/><br/>
    <b>Optimized</b>, it takes care of reading the data and re-renders the component only when your desired props have changed.
  `,
  uiBindingsCode: `
import { useData, useLoading, useError } from "@data-provider/react";

import { booksProvider } from "data/books";
import ErrorComponent from "components/error";

const Books = () => {
  const error = useError(booksProvider);
  const data = useData(booksProvider);
  const loading = useLoading(booksProvider);

  if (error) {
    return <ErrorComponent error={error}/>
  }
  return <BooksList data={data} loading={loading} />;
};

export default Books;
 `,
  cache: `
    The built-in cache ensures that Providers are <b>computed only once</b>.
    <br/><br/>
    Don't care about when a data has to be retrieved. Simply retrieve it always, Data Provider will do the optimization. <b>Avoid orchestrators and build fully modular pieces.</b>
    <br/><br/>
    Cache can be cleaned on-demand, and some specific origins providers implementations <b>even do it automatically</b> when needed.
  `,
  cacheCode: `
import Books from "views/books";

const RenderBooksTwice = () => {
  return (
    <div>
      <Books />
      <Books />
    </div>
  );
};

export default RenderBooksTwice;
  `,
  selectors: `
    Selectors are <b>recomputed whenever any dependency changes.</b>
    <br/><br/>
    Exposing the <b>same interface than providers</b> make consumers agnostic about what type of Provider or Selector are they consuming.
    <br/><br/>
    As in <a href="https://github.com/reduxjs/reselect" rel="noopener noreferrer">Reselect</a>, <b>Selectors are composable</b>. They can be used as input to other selectors.
    <br/><br/>
    <b>Powerful [dependencies api](docs/api-selector)</b>: Catch dependencies errors, retrieve them in parallel, declare them as functions returning other providers or selectors, etc.
  `,
  selectorsCode: `
import { Selector } from "@data-provider/core";

import { booksProvider } from "data/books";
import { authorsProvider } from "data/authors";

export const booksWithAuthor = new Selector(
  booksProvider,
  authorsProvider,
  (books, authors) => {
    return books.map(book => ({
      ...book,
      author: authors.find(
        author => author.id === book.authorId
      )
    }))
  }
);
  `,
  agnostic: `
    The Provider class provides the cache, state handler, etc., but not the <code>read</code method.
    The <code>read</code> behavior is implemented by different <b>[Data Provider Origins addons](docs/addons-intro)</b>.
    <br/><br/>
    There are different origins available, such as <b>[Axios](https://www.npmjs.com/package/@data-provider/axios),
    <a href="https://github.com/data-provider/browser-storage" rel="noopener noreferrer">LocalStorage</a>,
    <a href="https://github.com/data-provider/memory" rel="noopener noreferrer">Memory</a>, etc.</b> and building your own is easy. Read ["creating origin addons"](docs/addons-creating-origin-addons) for further info.
    <br/><br/>
    Sharing the same interface for all origins, and being able to build Selectors combining all of them implies that your logic will be <b>completely isolated about WHERE the data is being retrieved.</b>
  `,
  agnosticCode: `
import { Axios } from "@data-provider/axios";
import { LocalStorage } from "@data-provider/browser-storage";

export const books = new Axios("books", {
  url: \`/api/books\`
});

export const favoriteBooks = new LocalStorage("favorite-books", {
  initialState: {
    data: []
  }
});
  `,
  queryable: `
    Providers and selectors instances can be queried, which returns a new child instance with his own <code>queryValue</code>. Each different child has a different cache, different state, etc.
    <br/><br/>
    Different origins can use the <code>queryValue</code> for different purposes (API origins will normally use it for adding different params or query strings to the provider url, for example)
    <br/><br/>
    When the parent provider cache is clean, also the children is. <i>(For example, cleaning the cache of an API origin requesting to <code>/api/books</code>, will also clean the cache for <code>/api/books?author=2</code>)</i>
  `,
  queryableCode: `
import { useData, useLoading } from "@data-provider/react";

import { bookProvider } from "data/books";
import BookCard from "components/book-card";

const Book = ({ id }) => {
  const provider = bookProvider.query({ id });
  const book = useData(provider);
  const loading = useLoading(provider);

  if (loading) {
    return <Loading />;
  }
  return <BookCard title={book.title} author={book.author} />;
};

export default Book;
  `,
  eventEmitter: `
    In most of cases, the integrations addons available (like <a href="https://github.com/data-provider/react" rel="noopener noreferrer">@data-provider/react</a> will save you having to interact directly with the providers, but, for most complex use cases you can <b>listen to its events</b>.
    <br/><br/>
    If this is not enough, as Data Provider uses <a href="https://redux.js.org/" rel="noopener noreferrer">Redux</a> to handle providers states,
     it also provides an <code>[storeManager](docs/api-store-manager)</code> that allows to <b>migrate it to your own store</b> using  <code>combineReducers</code> for debugging purposes, for example.
    Every single provider also has a getter for retrieving its own <code>state</code> directly.
  `,
  eventEmitterCode: `
import {
  authorsProvider,
  authorProvider
} from "data/authors";

authorsProvider.on("readStart", () => {
  console.log("Authors request started");
});

authorProvider.onChild("*", eventName => {
  if (["update", "delete", "create"].includes(eventName)) {
    console.log("An author has been modified, cleaning cache");
    authorsProvider.cleanCache();
  }
});
  `,
  motivation: `
    As a front-end developer and what some call an &quot;architect&quot;, I've worked in
    very big projects, so I spent lot of time of last years trying to achieve a [fully modular system in which the team could reuse pieces across many applications...](docs/motivation)
  `,
};

const useContent = (textKey) => {
  return useText(textContents[textKey]);
};

function Heading({ text }) {
  return <h2 className="Heading">{text}</h2>;
}

function ActionButton({ href, type = "primary", target, children }) {
  return (
    <a className={`ActionButton ${type}`} href={href} target={target}>
      {children}
    </a>
  );
}

function TextColumn({ title, text, moreContent }) {
  return (
    <>
      <Heading text={title} />
      <div dangerouslySetInnerHTML={{ __html: text }} />
      {moreContent}
    </>
  );
}

function HomeCallToAction() {
  return (
    <>
      <ActionButton type="primary" href={useBaseUrl("docs/getting-started")} target="_self">
        Get started
      </ActionButton>
      <ActionButton type="secondary" href={useBaseUrl("docs/basics-intro")} target="_self">
        Learn basics
      </ActionButton>
    </>
  );
}

function GitHubStarButton() {
  return (
    <div className="github-button">
      <GitHubButton
        href="https://github.com/data-provider/core"
        data-icon="octicon-star"
        data-size="large"
        aria-label="Star Data Provider on GitHub"
      >
        Star
      </GitHubButton>
    </div>
  );
}

function Section({ element = "section", children, className, background = "light" }) {
  const El = element;
  return <El className={`Section ${className} ${background}`}>{children}</El>;
}

function TwoColumns({ columnOne, columnTwo, reverse }) {
  return (
    <div className={`TwoColumns ${reverse ? "reverse" : ""}`}>
      <div className={`column first ${reverse ? "right" : "left"}`}>{columnOne}</div>
      <div className={`column last ${reverse ? "left" : "right"}`}>{columnTwo}</div>
    </div>
  );
}

function ThreeColumns({ columnOne, columnTwo, columnThree }) {
  return (
    <div className={`ThreeColumns`}>
      <div className={`column first left`}>{columnOne}</div>
      <div className={`column center`}>{columnTwo}</div>
      <div className={`column last right`}>{columnThree}</div>
    </div>
  );
}

function HeaderHero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Section background="dark" className="HeaderHero">
      <TwoColumns
        reverse
        columnOne={<img alt="Data Provider logo" src={useBaseUrl("img/logo_white.svg")} />}
        columnTwo={
          <>
            <h1 className="title">{siteConfig.title}</h1>
            <p className="tagline">{siteConfig.tagline}</p>
            <div className="buttons">
              <HomeCallToAction />
            </div>
          </>
        }
      />
    </Section>
  );
}

function Benefits() {
  return (
    <Section className="Benefits">
      <ThreeColumns
        reverse
        columnOne={<TextColumn title="Cache and memoization" text={useContent("benefits_01")} />}
        columnTwo={
          <TextColumn title="Data, loading and error states" text={useContent("benefits_02")} />
        }
        columnThree={
          <TextColumn title="Selectors inspired by Reselect" text={useContent("benefits_03")} />
        }
      />
    </Section>
  );
}

function UIBindings({ reverse, background }) {
  return (
    <Section className="codeExample" background={background}>
      <TwoColumns
        reverse={reverse}
        columnOne={<TextColumn title="UI binding addons" text={useContent("uiBindings")} />}
        columnTwo={<CodeBlock language="jsx">{textContents.uiBindingsCode}</CodeBlock>}
      />
    </Section>
  );
}

function Cache({ reverse, background }) {
  return (
    <Section className="codeExample" background={background}>
      <TwoColumns
        reverse={reverse}
        columnOne={<TextColumn title="Cache and memoization" text={useContent("cache")} />}
        columnTwo={<CodeBlock language="jsx">{textContents.cacheCode}</CodeBlock>}
      />
    </Section>
  );
}

function Selectors({ reverse, background }) {
  return (
    <Section className="codeExample" background={background}>
      <TwoColumns
        reverse={reverse}
        columnOne={
          <TextColumn title="Selectors inspired by Reselect" text={useContent("selectors")} />
        }
        columnTwo={<CodeBlock language="json">{textContents.selectorsCode}</CodeBlock>}
      />
    </Section>
  );
}

function Agnostic({ reverse, background }) {
  return (
    <Section className="codeExample" background={background}>
      <TwoColumns
        reverse={reverse}
        columnOne={
          <TextColumn title="Agnostic about data origins" text={useContent("agnostic")} />
        }
        columnTwo={<CodeBlock language="json">{textContents.agnosticCode}</CodeBlock>}
      />
    </Section>
  );
}

function Queryable({ reverse, background }) {
  return (
    <Section className="Integrations codeExample" background={background}>
      <TwoColumns
        reverse={reverse}
        columnOne={<TextColumn title="Queryable" text={useContent("queryable")} />}
        columnTwo={<CodeBlock language="javascript">{textContents.queryableCode}</CodeBlock>}
      />
    </Section>
  );
}

function EventEmitter({ reverse, background }) {
  return (
    <Section className="codeExample" background={background}>
      <TwoColumns
        reverse={reverse}
        columnOne={
          <TextColumn title="Event emitter and Redux store" text={useContent("eventEmitter")} />
        }
        columnTwo={<CodeBlock language="javascript">{textContents.eventEmitterCode}</CodeBlock>}
      />
    </Section>
  );
}

function Motivation({ background }) {
  return (
    <Section className="Motivation" background={background}>
      <div className="content">
        <TextColumn title="Motivation" text={useContent("motivation")} />
      </div>
    </Section>
  );
}

function Star() {
  return (
    <Section className="Star" background="dark">
      <TwoColumns
        columnOne={
          <>
            <Heading text="Give it a star on GitHub" />
            <div className="StarLinkContainer">
              <GitHubStarButton />
            </div>
          </>
        }
        columnTwo={
          <>
            <Heading text="Become a backer" />
            <div className="StarLinkContainer">
              <a
                href="https://opencollective.com/data-provider"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="https://opencollective.com/data-provider/tiers/backer.svg?avatarHeight=70" />
              </a>
            </div>
          </>
        }
      />
      {/* <div className="content">
        <Heading text="Give it a star on GitHub" />
        <GitHubStarButton />
        <a
          href="https://opencollective.com/data-provider"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="https://opencollective.com/data-provider/tiers/backer.svg?avatarHeight=100" />
        </a>
      </div> */}
    </Section>
  );
}

const Index = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout wrapperClassName="homepage">
      <Head>
        <title>{siteConfig.title}</title>
        <meta
          name="description"
          content="Node.js mock server. Responses can be defined in json, JavaScript plain objects or Express middlewares. Supports defining different responses for the same route, and group them into different behaviors. Includes multiple interfaces, as an interactive CLI and a REST API."
        />
        <meta
          name="keywords"
          content="Node.js, mock server, simulated api, interactive, command line interface, api client, http, simulated response, REST API, api behaviors, developer friendly, hot reloading, testing, plugins, pluggable, Cypress"
        />
      </Head>
      <HeaderHero />
      <Benefits />
      <UIBindings background="tint" />
      <Cache reverse />
      <Selectors background="tint" />
      <Agnostic reverse />
      <Queryable background="tint" />
      <EventEmitter reverse />
      <Motivation background="tint" />
      <Star />
    </Layout>
  );
};

export default Index;
