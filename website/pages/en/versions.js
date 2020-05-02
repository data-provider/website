const React = require("react");
const PropTypes = require("prop-types");

const CompLibrary = require("../../core/CompLibrary");

const Container = CompLibrary.Container;

const CWD = process.cwd();

const versions = require(`${CWD}/versions.json`);

function Versions(props) {
  const { config: siteConfig } = props;
  const repoUrl = siteConfig.repoUrl;
  const latestVersion = versions[0];
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} Versions</h1>
          </header>
          <h3 id="latest">Current version (Stable)</h3>
          <table className="versions">
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                      props.language ? props.language + "/" : ""
                    }getting-started`}
                  >
                    Documentation
                  </a>
                </td>
                <td>
                  <a
                    href={`${repoUrl}/releases/tag/v${latestVersion}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Release Notes
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            This is the version that is configured automatically when you first install this
            project.
          </p>
          <h3 id="rc">Pre-release versions</h3>
          <table className="versions">
            <tbody>
              <tr>
                <th>release</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                      props.language ? props.language + "/" : ""
                    }next/getting-started`}
                  >
                    Documentation
                  </a>
                </td>
                <td>
                  <a href={`${repoUrl}/tree/release`} target="_blank" rel="noopener noreferrer">
                    Source Code
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            Check the{" "}
            <a href={siteConfig.githubProjectUrl} target="_blank" rel="noreferrer noopener">
              Github project
            </a>{" "}
            to stay up to date about upcoming features.
          </p>

          <h3 id="archive">Past Versions</h3>
          <p>Here you can find previous versions of the documentation.</p>
          <table className="versions">
            <tbody>
              {versions.map(
                (version) =>
                  version !== latestVersion && (
                    <tr key={version}>
                      <th>{version}</th>
                      <td>
                        {/* You are supposed to change this href where appropriate
                        Example: href="<baseUrl>/docs(/:language)/:version/:id" */}
                        <a
                          href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                            props.language ? props.language + "/" : ""
                          }${version}/getting-started`}
                        >
                          Documentation
                        </a>
                      </td>
                      <td>
                        <a
                          href={`${repoUrl}/releases/tag/v${version}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Release Notes
                        </a>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
          <p>
            You can find past versions of this project on{" "}
            <a href={`${repoUrl}/releases`} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}

Versions.propTypes = {
  config: PropTypes.object,
  language: PropTypes.string,
};

module.exports = Versions;
