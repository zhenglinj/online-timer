const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config');

const devConfig = Object.create(config);

devConfig.entry = [
  // Add the client which connects to our middleware
  // You can use full urls like 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'
  // useful if you run your app from another point like django
  'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
  // And then the actual application
  './source/entry.jsx'
];

devConfig.devtool = '#source-map';

devConfig.output.publicPath = "/built/";
devConfig.output.filename = "bundle.js";

devConfig.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    "__DEV__": true,
    "process.env": {
      NODE_ENV: JSON.stringify('development')
    }
  })
];

module.exports = devConfig;
