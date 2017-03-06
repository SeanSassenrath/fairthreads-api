const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const products = require('./models/product');
const path = require('path');
const methodOverride = require('method-override');
const dotenv = require('dotenv');

const app = express();
dotenv.load();

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

mongoose.connect(process.env.MONGO_LAB_URI);
// mongoose.connect(process.env.MONGO_LAB_LOCAL);

// don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
  // use morgan to log at command line
  app.use(morgan());
}

// logs all requests to the console

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next();
})

// routers
var adminRouter = require('./routes/admin/admin')(app, express);
app.use('/admin', adminRouter);

var productsRouter = require('./routes/public/products')(app, express);
app.use('/products', productsRouter);

var contactRouter = require('./routes/public/contact')(app, express);
app.use('/contact', contactRouter);



app.listen(config.port);
console.log("FairThread API is live on " + config.port);
