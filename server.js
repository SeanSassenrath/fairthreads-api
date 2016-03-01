var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var shopStyleApi = require('./shopstyle/shopstyle-api').addProducts
var products = require('./models/product');
var path = require('path');

mongoose.connect(config.mongoLabURI);
// mongoose.connect(config.mongoLocal);

// logs all requests to the console
app.use(morgan('dev'));
// shopStyleApi();

// CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next();
})
// routers
var productsRouter = require('./routes/products')(app, express);
app.use('/products', productsRouter);

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
