# Lightning Web Toolkit (LWT)

This repository contains an implementation of LWC OSS leveraging several different tools that maximize the speed and capabilities of writing lightning web componets. It is also an alternative to the Lightning Web Runtime.

## Features
- LWC OSS
- Vite 
  - Bundling toolkit via the vite-plugin-lwc project
  - First draft based on https://github.com/cardoso/vite-plugin-lwc-example
- Rollup 
  - Incorporates knowledge from lwc-navigo-rollup, which in turn is based on https://github.com/pmdartus/rcast
  - Vite uses rollup under the hood; lwc-rollup and lwc-navigo-rollup both relied on a vanilla rollup implementation
- Navigo
  - Enables routing and navigation
- Workbox
  - Toolkit for working with service workers
- Redux
  - State management and caching; works with Navigo to enable seamless navigation
- SLDS
  - Applies Salesforce styling to LWCs
- Lightning Base Components
- 3rd Party Libraries
  - Contains implementation of LightningWebChartJS
- Husky
  - On-Commit Linting

## Deprecations
This repository is intended to consolidate several different repos I've created that perform similar functions:
- lwc-navigo-rollup
- lwc-rollup
- lwc-webpack
- lwc-axios
- poetic-noise
- hybrid-lwc-base
  - Possibly this one. Not sure if I want to wrap cordova support into here.
- glandstack
  - GRANDStack hasn't been updated in a while and the repo was archived. All components still seem popular though, so implementations of Apollo, GraphQL, and Neo4j all could be on the table.

## Changelog
- lwc-navigo-rollup hides the index.html source file in the src directory. This runs counter to the way vite works, which relies upon having index.html in the project root to perform dependency analysis on it. LWT has to adapt to having this file in root. 
- lwc-navigo-rollup has an app.json file for heroku support. I am removing for now; consider re-adding as an enhancement.
- vite-plugin-lwc-example has a .github directory for GitHub pages support. This has been removed. 
- vite.config.mts has been renamed to vite.config.js; TypeScript support is being stripped and per https://vite.dev/guide/troubleshooting, "The closest package.json file has "type": "module", or use the .mjs/.mts extension, e.g. vite.config.mjs or vite.config.mts." -- Since type: module has been present in package.json, I believe the module ts (mts) extension is not needed.
- watch.js has been removed because vite performs watch livereload features much better
- Static assets have been moved from src/assets (location in lwc-navigo-rollup) to the vite public directory

## Enhancements
- Compare and contrast features of LWR to this repo and consider migrating to LWR as the base instead of vite-plugin-lwc
- Convert everything to typescript (vite-plugin-lwc-example is pure TS but I had to strip it out)
- Convert to an importable package
- Add heroku support

