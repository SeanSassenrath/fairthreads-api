var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var shopStyleApi = require('./shopstyle/shopstyle-api')
var products = require('./models/product');

mongoose.connect('mongodb://localhost:27017/fairthreads');

// logs all requests to the console
app.use(morgan('dev'));

app.listen(config.port);
console.log("FairThread API is live on " + config.port);
