'use strict';

const { execSync } = require('child_process');

const path = require('path');

const lwc = require('@lwc/rollup-plugin');
const replace = require('@rollup/plugin-replace');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');

const html = require('./plugin-html');
const cleanup = require('./plugin-cleanup');
const copyAssets = require('./plugin-copy-assets');
const serviceWorker = require('./plugin-service-worker');

const { __PROD__ } = require('./shared');

// Heroku doesn't setup git when building the application. The current git commit is set via the
// SOURCE_VERSION environment variable. https://devcenter.heroku.com/changelog-items/630
const COMMIT_HASH = (process.env.SOURCE_VERSION || execSync('git rev-parse HEAD').toString().trim()).slice(0, 7);

const isWatch = process.env.ROLLUP_WATCH;

module.exports = {
    input: {
        main: 'src/main.js',
    },

    preserveEntrySignatures: false,

    output: {
        dir: 'dist',
        entryFileNames: 'entry-[name]-[hash].js',
        format: 'esm',
        sourcemap: true,
    },

    manualChunks(id) {
        if (id.includes('node_modules')) {
            return 'vendor';
        }
    },

    plugins: [
        cleanup(),
        html(),
        copyAssets(),
        nodeResolve(),
        lwc({
            exclude: ['**/*.mjs'],
            rootDir: '.',
            modules: [
                {
                    dir: 'src/modules',
                },
                {
                    npm: 'lightning-base-components',
                },
            ],
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.COMMIT_HASH': JSON.stringify(COMMIT_HASH),
            'process.env.RELEASE_DATE': JSON.stringify(Date.now()),
        }),
        serviceWorker(),
        __PROD__ && terser(),
        isWatch &&
            serve({
                open: process.env.DEV_HOST_OPEN,
                host: process.env.DEV_HOST,
                port: process.env.DEV_PORT,
                contentBase: ['./dist'],
                historyApiFallback: true,
            }),
        isWatch &&
            livereload({
                watch: [path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'src')],
                exts: ['html', 'js', 'scss', 'sass', 'css'],
            }),
    ],
};
