var path = require('path');
var express = require('express');

var app = express();

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
