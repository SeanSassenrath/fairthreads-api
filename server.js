var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var shopStyleApi = require('./shopstyle/shopstyle-api').addProducts
var products = require('./models/product');

mongoose.connect('mongodb://heroku_52k3gzwv:5env2kro1te4ilkucu3cca484v@ds015478.mongolab.com:15478/heroku_52k3gzwv/fairthreads');
// mongoose.connect('mongodb://localhost:27017/fairthreads');

// logs all requests to the console
app.use(morgan('dev'));
shopStyleApi();

var apiRouter = express.Router();
apiRouter.use(function(req,res,next) {
  console.log('somebody just came to our app!')
  next();
})
apiRouter.get('/', function(req,res) {
  products.find(function(err,products) {
    if(err) {
      res.send(err);
    }
    else {
      res.json(products)
    }
  })
})
app.use('/api', apiRouter);
app.listen(config.port);
console.log("FairThread API is live on " + config.port);
