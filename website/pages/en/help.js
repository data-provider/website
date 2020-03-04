const React = require("react");
const PropTypes = require("prop-types");

const CompLibrary = require("../../core/CompLibrary.js");

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const { config: siteConfig, language = "" } = props;
  const {
    baseUrl,
    docsUrl,
    githubProjectUrl,
    codeOfConductUrl,
    contributingUrl,
    contributorCovenanceUrl
  } = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
  const langPart = `${language ? `${language}/` : ""}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content: `Learn more about using the [documentation on this site.](${docUrl(
        "getting-started"
      )})`,
      title: "Browse Docs"
    },
    {
      content: `Find out what's new with this project in the [github project](${githubProjectUrl}).`,
      title: "Stay up to date"
    }
  ];

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Need help?</h1>
          </header>
          <p>This is an open source project maintained by a dedicated group of people.</p>
          <p>
            Before participating in data-provider’s communities, please read our{" "}
            <a href={codeOfConductUrl} target="_blank" rel="noreferrer noopener">
              Code of Conduct
            </a>
            . We have adopted the{" "}
            <a href={contributorCovenanceUrl} target="_blank" rel="noreferrer noopener">
              Contributor Covenant
            </a>{" "}
            and we expect that all community members adhere to the guidelines within.{" "}
          </p>
          <p>
            <b>Contributors are welcome</b>. Please read the{" "}
            <a href={contributingUrl} target="_blank" rel="noreferrer noopener">
              contributing guidelines
            </a>
            .
          </p>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

Help.propTypes = {
  config: PropTypes.object,
  language: PropTypes.string
};

module.exports = Help;
