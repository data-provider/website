/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = require("./users");

const organizationUrl = "https://github.com/data-provider";
const baseUrl = "/";
const repoUrl = `${organizationUrl}/core`;
const coreRepoUrl = `${organizationUrl}/core`;
const webSiteRepoUrl = `${organizationUrl}/website`;

const siteConfig = {
  title: "Data Provider", // Title for your website.
  tagline: "JavaScript Async Data Provider",
  url: "https://www.data-provider.org", // Your website URL
  repoUrl,
  baseUrl, // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: "data-provider",
  organizationName: "data-provider",
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: "getting-started", label: "Get started" },
    { doc: "basics-intro", label: "Tutorial" },
    { doc: "api-reference", label: "API" },
    { page: "help", label: "Help" },
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: "img/logo_64_white.png",
  footerIcon: "img/logo_white.svg",
  favicon: "img/favicon.ico",

  /* Colors for website */
  colors: {
    primaryColor: "#28509a",
    secondaryColor: "#6884b8",
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Javier Brea`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: "atom-one-dark",
  },

  usePrism: ["js", "bash"],

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    "https://buttons.github.io/buttons.js",
    "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js",
    "/js/code-block-buttons.js",
  ],

  // On page navigation for the current documentation page.
  onPageNav: "separate",
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: "img/og_image.jpg",
  twitterImage: "img/og_image_twitter.jpg",
  twitterUsername: "dataprovider2",

  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.
  docsSideNavCollapsible: true,

  gaTrackingId: "UA-158982048-1",
  gaGtag: true,

  algolia: {
    apiKey: "449d11b242930928dc2b89189eda6c5a",
    indexName: "data-provider",
    algoliaOptions: {}, // Optional, if provided by Algolia
  },

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
  organizationUrl,
  webSiteRepoUrl,
  githubProjectUrl: "https://github.com/orgs/data-provider/projects/1",
  githubIssuesUrl: `${coreRepoUrl}/issues`,
  websiteIssuesUrl: `${webSiteRepoUrl}/issues`,
  npmUrl: "https://www.npmjs.com/package/@data-provider/core",
  codeOfConductUrl: `${repoUrl}/blob/master/.github/CODE_OF_CONDUCT.md`,
  contributingUrl: `${repoUrl}/blob/master/.github/CONTRIBUTING.md`,
  contributorCovenanceUrl: "https://www.contributor-covenant.org/",
  nextVersion: "v2.0.0",
};

module.exports = siteConfig;
