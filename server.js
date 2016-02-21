var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');

// logs all requests to the console
app.use(morgan('dev'))

app.listen(config.port);
console.log("FairThread API is live on " + config.port);
