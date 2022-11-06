module.exports = {
  title: "Data Provider",
  tagline: "JavaScript Async Data Provider",
  url: "https://www.data-provider.org",
  baseUrl: "/",
  organizationName: "data-provider",
  projectName: "data-provider",
  scripts: ["https://buttons.github.io/buttons.js"],
  favicon: "img/favicon.ico",
  customFields: {
    repoUrl: "https://github.com/data-provider/core",
    users: [],
    gaGtag: true,
    organizationUrl: "https://github.com/data-provider",
    webSiteRepoUrl: "https://github.com/data-provider/website",
    githubProjectUrl: "https://github.com/orgs/data-provider/projects/1",
    githubIssuesUrl: "https://github.com/data-provider/core/issues",
    websiteIssuesUrl: "https://github.com/data-provider/website/issues",
    npmUrl: "https://www.npmjs.com/package/@data-provider/core",
    codeOfConductUrl:
      "https://github.com/data-provider/core/blob/master/.github/CODE_OF_CONDUCT.md",
    contributingUrl: "https://github.com/data-provider/core/blob/master/.github/CONTRIBUTING.md",
    contributorCovenanceUrl: "https://www.contributor-covenant.org/",
  },
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          editUrl: "https://github.com/data-provider/website/edit/master/docs/",
          path: "./docs",
          sidebarPath: require.resolve("./sidebars.json"),
        },
        theme: {
          customCss: [
            require.resolve("./src/css/custom.scss"),
            require.resolve("./src/css/index.scss"),
          ],
        },
        gtag: {
          trackingID: "UA-158982048-1",
          anonymizeIP: true,
        },
      },
    ],
  ],
  plugins: ["docusaurus-plugin-sass"],
  themeConfig: {
    prism: {
      defaultLanguage: "javascript",
      additionalLanguages: ["bash", "json"],
    },
    navbar: {
      hideOnScroll: true,
      style: "dark",
      title: "Data Provider",
      logo: {
        src: "img/logo_64_white.png",
      },
      items: [
        {
          to: "docs/getting-started",
          label: "Get started",
          position: "right",
        },
        {
          to: "docs/basics-intro",
          label: "Tutorial",
          position: "right",
        },
        {
          to: "docs/api-reference",
          label: "API",
          position: "right",
        },
        {
          href: "https://github.com/data-provider/core",
          "aria-label": "GitHub repository",
          position: "right",
          className: "navbar-github-link",
        },
        {
          type: "docsVersionDropdown",
          position: "left",
          dropdownActiveClassDisabled: true,
        },
      ],
    },
    image: "img/og_image.jpg",
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "docs/getting-started",
            },
            {
              to: "docs/basics-intro",
              label: "Tutorial",
            },
            {
              to: "docs/api-reference",
              label: "API",
            },
            {
              label: "Addons",
              to: "docs/addons-intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Contributors guidelines",
              to: "https://github.com/data-provider/core/blob/master/.github/CONTRIBUTING.md",
            },
            {
              label: "Code of conduct",
              to: "https://github.com/data-provider/core/blob/master/.github/CODE_OF_CONDUCT.md",
            },
            {
              label: "Github project",
              to: "https://github.com/orgs/data-provider/projects/1",
            },
            {
              label: "Issues",
              to: "https://github.com/data-provider/core/issues",
            },
          ],
        },
        {
          title: "Find us",
          items: [
            {
              label: "Twitter",
              to: "https://twitter.com/dataprovider2",
            },
            {
              label: "Github",
              to: "https://github.com/data-provider",
            },
          ],
        },
      ],
      copyright: "Copyright © 2019-2022 Javier Brea",
      logo: {
        alt: "Data Provider logo",
        src: "img/logo_white.svg",
        href: "https://www.data-provider.org",
      },
    },
    algolia: {
      appId: "VSFIYFAALU",
      apiKey: "22f330a811273f6c83e3f2e46360efc5",
      indexName: "data-provider",
      contextualSearch: true,
    },
  },
};
