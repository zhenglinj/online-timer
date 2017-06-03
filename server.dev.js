var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.dev.config');

var app = express();
var compiler = webpack(config);

app.set('port', (process.env.PORT || 5000));

// Customize log
app.use(require('morgan')('short'));

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler, {
  log: console.log,
  path: "/__webpack_hmr",
  heartbeat: 2000
}));

app.use("/", express.static(path.join(__dirname)));

app.get("/", (request, response) => {
  response.sendfile(path.join(__dirname, "index.html"))
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
