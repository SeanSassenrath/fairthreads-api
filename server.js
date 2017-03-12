const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('config');
const products = require('./models/product');
const path = require('path');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const { pullProducts } = require('./shopstyle/shopstyle-api');

const app = express();
dotenv.load();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// pullProducts();

const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
};

mongoose.Promise = require('bluebird');

mongoose.connect(config.DBHost, options);
// mongoose.connect(process.env.MONGO_LAB_TEST_URI, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// routers
const apiRouter = require('./controller/api');
app.use('/api', apiRouter);
// const adminRouter = require('./routes/admin/admin')(app, express);
// app.use('/admin', adminRouter);

// const productsRouter = require('./routes/public/products')(app, express);
// app.use('/products', productsRouter);

// const contactRouter = require('./routes/public/contact')(app, express);
// app.use('/contact', contactRouter);



app.listen(process.env.PORT || 9000);
console.log(`FairThread API is live on ${process.env.PORT || 9000}`);

module.exports = app;
