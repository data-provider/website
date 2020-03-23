const React = require("react");
const PropTypes = require("prop-types");

const CompLibrary = require("../../core/CompLibrary.js");

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;
const MarkdownBlock = CompLibrary.MarkdownBlock;

const CodeExampleSection = ({ id, background, title, left, right }) => {
  return (
    <Container id={id} className={background}>
      <div className="gridBlock">
        <div className="blockElement twoByGridBlock">
          <div className="blockContent">
            <h2>
              <div>
                <span>
                  <p>{title}</p>
                </span>
              </div>
            </h2>
            <div>
              <span>
                <MarkdownBlock>{left}</MarkdownBlock>
              </span>
            </div>
          </div>
        </div>
        <div className="blockElement twoByGridBlock">
          <div className="blockContent">
            <div className="code-example">
              <span>
                <MarkdownBlock>{right}</MarkdownBlock>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

CodeExampleSection.propTypes = {
  id: PropTypes.string,
  background: PropTypes.string,
  title: PropTypes.string,
  left: PropTypes.string,
  right: PropTypes.string
};

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        <span className="title">{siteConfig.title}</span>
        <small className="tagline">{siteConfig.tagline}</small>
      </h2>
    );

    const ProjectMotto = () => (
      <h3 className="projectPromo">
        Powered by Redux
        <br />
        Agnostic about data origins
        <br />
        Framework agnostic
      </h3>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button get-started" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <ProjectMotto />
          <PromoSection>
            <Button href={docUrl("getting-started")}>Get started</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

HomeSplash.propTypes = {
  siteConfig: PropTypes.object,
  language: PropTypes.string
};

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const Features = () => (
      <Container id="home-features" background="light">
        <GridBlock
          contents={[
            {
              title: "Selectors inspired by Reselect",
              content: `Compute data derived from other Providers or Selectors with a [familiar and very powerful syntax](${docUrl(
                "api-selector"
              )}).`
            },
            {
              title: "Cache and memoization",
              content: `Optimized. Don't care about how many times do you call simultaneously to read a provider.`
            },
            {
              title: "Data, loading and error states",
              content: `Handling asynchronies implies handling error and loading states. Data Provider makes this job for you.`
            }
          ]}
          layout="fourColumn"
        />
      </Container>
    );

    const ReactFeatures = () => {
      return (
        <CodeExampleSection
          id="home-react"
          title="React hooks and HOCs"
          left={`Data Provider is not concerned about the views, but UI binding addons are available.

The [@data-provider/react](https://www.npmjs.com/package/@data-provider/react) package __gives you HOCs to connect providers to your components__, creating a wrapper component handling all the logic for you.

It also provides __hooks like "useData", "useLoading", etc.__

__Optimized__, it takes care of reading the data and re-renders the component only when your desired props have changed.`}
          right={`
\`\`\` javascript
import { withDataProvider } from "@data-provider/react";

import { booksProvider } from "data/books";
import ErrorComponent from "components/error";

const Books = ({ data, loading, error }) => {
  if (error) {
    return <ErrorComponent error={error}/>
  }
  return <BooksList data={data} loading={loading} />;
};

export default withDataProvider(booksProvider)(Books);
\`\`\`
`}
        />
      );
    };

    const Cache = () => {
      return (
        <CodeExampleSection
          id="home-cache"
          background="lightBackground"
          title="Cache and memoization"
          left={`
 The built-in cache ensures that Providers are __computed only once__.

Don't care about when a data has to be retrieved. Simply retrieve it always, Data Provider will do the optimization. __Avoid orchestrators and build fully modular pieces.__

Cache can be cleaned on-demand, and some specific origins providers implementations __even do it automatically__ when needed.
`}
          right={`
\`\`\` javascript
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
\`\`\`
`}
        />
      );
    };

    const Agnostic = () => {
      return (
        <CodeExampleSection
          id="home-agnostic"
          title="Agnostic about data origins"
          left={`
The Provider class provides the cache, state handler, etc., but not the "read" method. The "read" behavior is implemented by __different Data Provider Origins addons__.

There are different origins available, such as __[Axios](https://www.npmjs.com/package/@data-provider/axios), [LocalStorage](https://www.npmjs.com/package/@data-provider/browser-storage), [Memory](https://www.npmjs.com/package/@data-provider/memory), etc.__ and building your own is so easy as extending the Provider class with a custom "readMethod".

Sharing the same interface for all origins, and being able to build Selectors combining all of them implies that your logic will be __completely isolated about WHERE the data is being retrieved.__
`}
          right={`
\`\`\`javascript
import { Axios } from "@data-provider/axios";
import { LocalStorage } from "@data-provider/browser-storage";

export const books = new Axios("books", {
  url: "/api/books"
});

export const favoriteBooks = new LocalStorage("favorite-books", {
  initialState: {
    data: []
  }
});
\`\`\`
`}
        />
      );
    };

    const Selectors = () => {
      return (
        <CodeExampleSection
          id="home-selectors"
          title="Selectors inspired by Reselect"
          background="lightBackground"
          left={`Selectors are __recomputed whenever any dependency changes.__

Exposing the __same interface than providers__ make consumers agnostic about what type of Provider or Selector are they consuming.

As in [Reselect](https://github.com/reduxjs/reselect), __Selectors are composable__. They can be used as input to other selectors.

__Powerful [dependencies api](${docUrl(
            "api-selector"
          )})__: Catch dependencies errors, retrieve them in parallel, declare them as functions returning other providers or selectors, etc.
`}
          right={`
\`\`\`javascript
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
\`\`\`
`}
        />
      );
    };

    const Queryable = () => {
      return (
        <CodeExampleSection
          id="home-queryable"
          title="Queryable"
          left={`Providers and selectors instances can be queried, which returns a new child instance with his own "query value".

Each different child has a different cache, different state, etc.

Different origins can use the "query" value for different purposes (API origins will normally use it for adding different params or query strings to the provider url)

When the parent provider cache is clean, also the children is. _(For example, cleaning the cache of an API origin requesting to "/api/books", will also clean the cache for "/api/books?author=2")_
`}
          right={`
\`\`\`javascript
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
\`\`\`
`}
        />
      );
    };

    const Events = () => {
      return (
        <CodeExampleSection
          id="home-events"
          title="Redux store and event emitter"
          left={`In most of cases, the integrations addons available (like [@data-provider/react](https://www.npmjs.com/package/@data-provider/react)) will save you having to interact directly with the providers, but, for most complex use cases you can __listen to its events__.

If this is not enough, as Data Provider uses [Redux](https://redux.js.org/) to handle providers states, it also provides an [\`storeManager\`](${docUrl(
            "api-store-manager"
          )}) that allows to __migrate it to your own store__ using  \`combineReducers\`.

Every single provider also has a method for accesing to his own "state" directly.
`}
          right={`
\`\`\`javascript
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

\`\`\`
`}
        />
      );
    };

    const Motivation = () => (
      <div
        className="productShowcaseSection paddingBottom paddingTop"
        style={{ textAlign: "center" }}
        id="home-motivation"
      >
        <h2>Motivation</h2>
        <p>
          As a front-end developer and what some call an &quot;architect&quot;, I&apos;ve worked in
          very big projects, so I spent lot of time of last years trying to achieve a{" "}
          <a href={docUrl("motivation")}>
            fully modular system in which the team could{" "}
            <b>reuse pieces across many applications...</b>
          </a>
        </p>
      </div>
    );

    const Showcase = () => {
      const pinnedUsers = siteConfig.users ? siteConfig.users.filter(user => user.pinned) : [];
      if (pinnedUsers.length === 0) {
        return null;
      }

      const showcase = pinnedUsers.map(user => (
        <a href={user.infoLink} key={user.infoLink}>
          <img src={user.image} alt={user.caption} title={user.caption} />
        </a>
      ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

      return (
        <div className="productShowcaseSection paddingBottom ">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl("users")}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer home">
          <Features />
          <ReactFeatures />
          <Cache />
          <Selectors />
          <Agnostic />
          <Queryable />
          <Events />
          <Motivation />
          <Showcase />
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  config: PropTypes.object,
  language: PropTypes.string
};

module.exports = Index;
