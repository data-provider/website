module.exports={
  "title": "Data Provider",
  "tagline": "JavaScript Async Data Provider",
  "url": "https://www.data-provider.org",
  "baseUrl": "/",
  "organizationName": "data-provider",
  "projectName": "data-provider",
  "scripts": [
    "https://buttons.github.io/buttons.js",
    "https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js",
    "/js/code-block-buttons.js"
  ],
  "favicon": "img/favicon.ico",
  "customFields": {
    "repoUrl": "https://github.com/data-provider/core",
    "users": [
      {
        "caption": "Domapic",
        "image": "https://domapic.com/assets/domapic-logo.png",
        "infoLink": "https://www.domapic.com",
        "pinned": false
      }
    ],
    "gaGtag": true,
    "organizationUrl": "https://github.com/data-provider",
    "webSiteRepoUrl": "https://github.com/data-provider/website",
    "githubProjectUrl": "https://github.com/orgs/data-provider/projects/1",
    "githubIssuesUrl": "https://github.com/data-provider/core/issues",
    "websiteIssuesUrl": "https://github.com/data-provider/website/issues",
    "npmUrl": "https://www.npmjs.com/package/@data-provider/core",
    "codeOfConductUrl": "https://github.com/data-provider/core/blob/master/.github/CODE_OF_CONDUCT.md",
    "contributingUrl": "https://github.com/data-provider/core/blob/master/.github/CONTRIBUTING.md",
    "contributorCovenanceUrl": "https://www.contributor-covenant.org/",
    "nextVersion": "v2.9.0"
  },
  "onBrokenLinks": "log",
  "onBrokenMarkdownLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "homePageId": "getting-started",
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "path": "../docs",
          "sidebarPath": "../website/sidebars.json"
        },
        "blog": {},
        "theme": {
          "customCss": "../src/css/customTheme.css"
        }
      }
    ]
  ],
  "plugins": [],
  "themeConfig": {
    "navbar": {
      "title": "Data Provider",
      "logo": {
        "src": "img/logo_64_white.png"
      },
      "items": [
        {
          "to": "docs/",
          "label": "Get started",
          "position": "left"
        },
        {
          "to": "docs/basics-intro",
          "label": "Tutorial",
          "position": "left"
        },
        {
          "to": "docs/api-reference",
          "label": "API",
          "position": "left"
        },
        {
          "to": "/help",
          "label": "Help",
          "position": "left"
        },
        {
          "label": "Version",
          "to": "docs",
          "position": "right",
          "items": [
            {
              "label": "2.9.0",
              "to": "docs/",
              "activeBaseRegex": "docs/(?!2.1.2|2.2.0|2.3.0|2.5.0|2.6.0|2.7.0|2.8.0|2.9.0|next)"
            },
            {
              "label": "2.8.0",
              "to": "docs/2.8.0/"
            },
            {
              "label": "2.7.0",
              "to": "docs/2.7.0/"
            },
            {
              "label": "2.6.0",
              "to": "docs/2.6.0/"
            },
            {
              "label": "2.5.0",
              "to": "docs/2.5.0/"
            },
            {
              "label": "2.3.0",
              "to": "docs/2.3.0/"
            },
            {
              "label": "2.2.0",
              "to": "docs/2.2.0/"
            },
            {
              "label": "2.1.2",
              "to": "docs/2.1.2/"
            },
            {
              "label": "Master/Unreleased",
              "to": "docs/next/",
              "activeBaseRegex": "docs/next/(?!support|team|resources)"
            }
          ]
        }
      ]
    },
    "image": "img/og_image.jpg",
    "footer": {
      "links": [
        {
          "title": "Community",
          "items": [
            {
              "label": "Twitter",
              "to": "https://twitter.com/dataprovider2"
            }
          ]
        }
      ],
      "copyright": "Copyright © 2021 Javier Brea",
      "logo": {
        "src": "img/logo_white.svg"
      }
    },
    "algolia": {
      "apiKey": "449d11b242930928dc2b89189eda6c5a",
      "indexName": "data-provider",
      "algoliaOptions": {}
    },
    "gtag": {
      "trackingID": "UA-158982048-1"
    }
  }
}