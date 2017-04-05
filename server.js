const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var index = require('./src/index.js');

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function(request, response) {
    var html = ReactDOMServer.renderToString(
        React.createElement(index)
    );
    response.send(html);
});

app.listen(process.env.PORT || 8080);
console.log(`Serving at http://localhost:8080`);
