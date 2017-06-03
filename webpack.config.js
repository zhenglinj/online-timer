var path = require('path');

module.exports = {
  // devtool: '#source-map',
  // webpack folder's entry js - excluded from jekll's build process.
  entry: "./source/entry.jsx",
  output: {
    // we're going to put the generated file in the assets folder so jekyll will grab it.
    path: path.join(__dirname, '/built/'),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.js$/,
        loaders: ['babel?cacheDirectory'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.styl$/,
        loaders: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.json/,
        loaders: ['json-loader']
      }
    ]
  }
};
