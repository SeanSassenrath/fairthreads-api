var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var shopStyleApi = require('./shopstyle/shopstyle-api').addProducts
var products = require('./models/product');
var path = require('path');
var methodOverride = require('method-override')
app.set("view engine", "ejs");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride(function(req, res){
 if (req.body && typeof req.body === 'object' && '_method' in req.body) {
   // look in urlencoded POST bodies and delete it
   var method = req.body._method
   delete req.body._method
   return method
 }
}))

// app.get('/', function(req,res) {
// 	res.render('./views/admin/about')
// })

mongoose.connect(config.mongoLabURI);
// mongoose.connect(config.mongoLocal);

// logs all requests to the console
app.use(morgan('dev'));
// shopStyleApi();

app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next();
})

// routers
var adminRouter = require('./routes/admin/admin')(app, express);
app.use('/admin', adminRouter);

var productsRouter = require('./routes/public/products')(app, express);
app.use('/products', productsRouter);



app.listen(config.port);
console.log("FairThread API is live on " + config.port);
