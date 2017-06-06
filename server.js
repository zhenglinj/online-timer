var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');

var app = express();
var compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) {
    console.log(err);
    console.log(stats);
    return;
  }
});

app.set('port', (process.env.PORT || 5000));

// Customize log
app.use(require('morgan')('short'));

app.use("/", express.static(path.join(__dirname)));

app.get("/", (request, response) => {
  response.sendfile(path.join(__dirname, "index.html"))
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
