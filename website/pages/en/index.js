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
            <Button href={docUrl("get-started-intro")}>Get started</Button>
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
              content: `Lorem ipsum dolor sit amet, [adipiscing elit](${docUrl(
                "get-started-intro"
              )}) Donec turpis neque, pretium at efficitur vitae, congue sed sem. Nam gravida vehicula ante ut aliquet. Mauris sed ante pharetra.`
            },
            {
              title: "Cache and memoization",
              content: `Aliquam [ultricies dolor nec](${docUrl(
                "get-started-intro"
              )}) augue hendrerit elementum. Donec sit amet rhoncus ipsum. Mauris non augue dignissim arcu placerat sodales vel ut est. Nam imperdiet ut magna convallis finibus. [Suspendisse](${docUrl(
                "get-started-intro"
              )}).`
            },
            {
              title: "Handler data, loading and error",
              content: `Sed vestibulum mauris egestas libero gravida, et luctus velit malesuada. Donec sodales ut ipsum sed placerat. Suspendisse quis tristique risus. Duis eu orci nec sem consequat consectetur. [Sed eget](${docUrl(
                "get-started-intro"
              )}).`
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
          left={`
Maecenas scelerisque tristique viverra. Suspendisse finibus [erat erat](${docUrl(
            "get-started-intro"
          )})
Nam hendrerit rutrum eros, quis sagittis dolor pulvinar vel. Suspendisse ut vehicula turpis. Duis tempor, turpis vitae varius vulputate, quam tellus pellentesque ex, non bibendum metus justo lobortis arcu. Pellentesque sed eros vel nisl molestie maximus sit amet et odio.
`}
          right={`
\`\`\` javascript
import { withDataProvider } from "@data-provider/react";
import { booksProvider } from "data/books";

const Books = ({ data, loading, error }) => {
  return <BooksList data={data} loading={loading} error={error} />;
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
Donec a odio vulputate, volutpat libero eget, semper ligula.

Quisque est nisl, lacinia sit amet mattis vitae, tristique eu metus. Curabitur sapien libero, tincidunt sed feugiat quis, lacinia et arcu.

Nulla facilisi. Curabitur vulputate tincidunt congue. Aliquam nulla nisi, tristique eu egestas sit amet, mollis rhoncus purus. Sed non massa tincidunt, dignissim tortor et, accumsan nulla. 
`}
          right={`
\`\`\` javascript
import { withData, useRefresh } from "@data-provider/react";
import { booksProvider } from "data/books";

const BooksLengthComponent = ({ data }) => {
  useRefresh(booksProvider);
  return <div>There are {data.length} books</div>;
};

export default withData(booksProvider)(Books);
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
Morbi dictum nisi non ex convallis venenatis. Phasellus vestibulum sollicitudin nulla et semper. Vestibulum suscipit pellentesque laoreet. Curabitur viverra mattis semper. Maecenas consectetur diam sed lectus sagittis ornare.

Donec dapibus purus enim, at finibus nulla volutpat at. Curabitur nec felis condimentum, tincidunt enim et, consequat mauris. 
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
          left={`Donec a odio vulputate, volutpat libero eget, semper ligula. Quisque est nisl, lacinia sit amet mattis vitae, tristique eu metus. Curabitur sapien libero, tincidunt sed feugiat quis, lacinia et arcu. Nulla facilisi.

Curabitur vulputate tincidunt congue. Aliquam nulla nisi, tristique eu egestas sit amet, mollis rhoncus purus.
`}
          right={`
\`\`\`javascript
import { Selector } from "@data-provider/core";

import { booksProvider } from "data/books";
import { authorsProvider } from "data/authors";

export const authorsWithBooks = new Selector(
  authorsProvider,
  booksProvider,
  (authors, books) => {
    return authors.map(author => ({
      ...author,
      books: books.filter(book => book.authorId === author.id)
    }))
  }
);
\`\`\`
`}
        />
      );
    };

    const Roadmap = () => (
      <div
        className="productShowcaseSection paddingBottom paddingTop"
        style={{ textAlign: "center" }}
      >
        <h2>Motivation</h2>
        <p>
          Sed vestibulum mauris egestas libero gravida, et luctus velit malesuada. Donec sodales ut
          ipsum sed placerat. Suspendisse quis tristique risus. Duis eu orci nec sem consequat
          consectetur.
          <br />
          Sed eget ullamcorper sapien, varius dignissim quam. Vivamus malesuada feugiat rhoncus.
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
        <div className="productShowcaseSection paddingBottom">
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
          <Agnostic />
          <Selectors />
          <Roadmap />
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
