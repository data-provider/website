---
id: version-2.1.2-installation
title: Installation
original_id: installation
---

## NPM Installation

To install the stable version from NPM:

```bash
npm i redux @data-provider/core
```

This will install both Data Provider and Redux, which is a `peerDependency` of the project.

## Other installation methods

The project is exported in CommonJS, ESM and UMD formats, that can be found inside the `/dist` folder of the distribution.

The source code is written in ES2015 but both CommonJS and UMD builds are precompiled to ES5 so they work in any modern browser. You don't need to use Babel or a module bundler to get started.

If you use a module bundler as Webpack, Rollup, etc, it will be at charge of reading the correspondant file automatically, if not, you can use directly the UMD file in the `dist` folder with a `<script>` tag in your HTML, loading it from unpkg, or from your own downloaded file. You only have to remember to first load [Redux][redux] and [isPromise][is-promise] dependencies with correspondant `<script>` tags. The UMD build makes Data Provider available as a `window.dataProvider` global variable.

### UMD load example

```html
<script src="https://unpkg.com/redux@4.0.5/dist/redux.js"></script>
<script src="https://unpkg.com/is-promise@2.1.0/index.js"></script>
<script src="https://unpkg.com/@data-provider/core@2.0.0/dist/index.umd.js"></script>
<script>
  console.log(window.dataProvider);
</script>
```

## Install specific origins

Data Provider itself does not really retrieve data from any specific data origin, so you'll have to install the origins of your choice separatelly.

For example, to retrieve data from a REST API you can use the [@data-provider/axios][data-provider-axios] addon:

```bash
npm i @data-provider/axios
```

In the case of this addon, exportation formats are the same than described for the @data-provider/core package. For other addons, you should read its own documentation.

[data-provider-axios]: https://www.npmjs.com/package/@data-provider/axios
[redux]: https://redux.js.org/
[is-promise]: https://www.npmjs.com/package/is-promise
