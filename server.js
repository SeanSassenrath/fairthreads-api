var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect('mongodb://localhost:27017/myProducts');


// logs all requests to the console
app.use(morgan('dev'));

// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
//   Authorization');
//   next();
//   });

var product = require('./models/product');

product.saveTop()

app.listen(config.port);
console.log("FairThread API is live on " + config.port);
