# ReplaceInSrcWebpackPlugin

This is a [webpack](http://webpack.github.io/) plugin that can replace content in file(s) after compilation is done. This is useful when you want to replace content in any kind of files(html, css, js etc) which are not processed by loaders.

## Installation

Install the plugin with npm:
```shell
npm install replace-in-src-webpack-plugin --save-dev
```

## Basic Usage

Add the plugin to your webpack and config as follows:

```javascript
  const ReplaceInSrcWebpackPlugin = require('replace-in-src-webpack-plugin');
  const webpackConfig = {
    entry: 'index.js',
    output: {
      path: __dirname + '/dist',
      filename: 'index_bundle.js'
    },
    plugins: [
      new ReplaceInSrcWebpackPlugin([
        {
          dir: 'dist',
          files: ['index.html', 'main.html'],
          rules: [
            {
              search: '@class',
              replace: 'main-class'
            },
            {
              search: /@title/,
              replace: 'webpack'
            }
          ]
        }, 
        {
          dir: 'dist/style',
          test: /\.html$/,
          rules: [
            {
              search: /version/ig,
              replace: '1.0.0'
            },
            {
              search: '@title',
              replace: function(match) {
                const fileName = this.file;
              }
            }
          ]
        },
        {
          dir: 'dist/style',
          test: [/\.css$/, /\.txt/],
          rules: [
            {
              search: /version/ig,
              replace: '1.0.0'
            },
            {
              search: '@title',
              replace: 'webpack'
            }
          ]
        }
      ])
    ]
  };
```

## Configuration

You can pass an array of configuration options to `ReplaceInSrcWebpackPlugin`. Each configuration has following items:

- `dir`: Optional. Base dir to find the files, if not provided, use the root of webpack context.
- `files`: Optional. Files in `dir` to find for replacement.
- `test`: Optional. Regex expression or Regex expressions array to match files in `dir`.
- `rules`: Required. Replace content rules array. Each rule has `search` and `replace` properties.
- `search`: Required. String or Regex expression used for searching content in files.
- `replace`: Required. String or function used for replacing the searching content.

