var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var shopStyleApi = require('./shopstyle/shopstyle-api').addProducts
var products = require('./models/product');
var path = require('path');
app.set("view engine", "ejs");

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(config.mongoLabURI);
// mongoose.connect(config.mongoLocal);

// logs all requests to the console
app.use(morgan('dev'));
// shopStyleApi();

// CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next();
})

// routers
var productsRouter = require('./routes/products')(app, express);
app.use('/products', productsRouter);


//API route

var apiRouter = express.Router();

//middleware
apiRouter.use(function(req,res,next) {
  console.log('somebody just came to our app!')
  next();
})

//api endpoint
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

var adminRouter = express.Router();

adminRouter.route('/')
  .get(function(req,res) {
      products.find(function(err,products) {
      if(err) {
        res.send(err);
      }
      else {
        res.render('admin/index', {
          products: products
        })  
      }
    })
  });



adminRouter.route('/product/:product_id')
  .get(function(req,res) {
      var id = req.params.product_id
      products.findById(id, function(req, product) {
        res.render('admin/product', {
          product: product
        })
      })
  })
  .put(function(req,res) {
    console.log("this is my", req)
    var newId = req.params.product_id
    products.findById(newId, function(req, product) {
      if (req.body.name) {product.name = req.body.name }
      if (req.body.description) product.description = req.body.description;
      if (req.body.vendUrl) product.vendUrl = req.body.vendUrl;
      if (req.body.category) product.category = req.body.category;    
      product.save(function(err) {
        if(err) res.send(err)
          res.redirect('/')

      })


    })
  })


  // adminRouter.get('/:id', function(req,res) {
  //   products.findById(req.params._id, function(req, products) {
  //     res.render('/product', {
  //       products:products,
  //       uniqeID: req.params._id
  //     })
  //   })
  // })
  // adminRouter.put('/:id', function(req,res) {
  //   products.findById(req.params._id, function(req, product) {
  //     res.render('/product' {
  //       products: products,
  //       currentItem: req.params._id
  //     })
  //   })
  // })
  // .put(function(req,res) {
  //     products.find(function(err,products) {
  //       res.render('admin/index', {
  //         products: products,
  //         currentProduct: req.params.id
  //       })
  //     })
  // })

    
    adminRouter.delete('/product/:id', function(req,res) {
      products.remove({
        _id: req.params._id
      }, function(err,product) {
        if(err, product) {
          return res.send(err)
        }
        else {
          res.rediret('/')
        }
      })
    }) 




app.use('/api', apiRouter);
app.use('/admin', adminRouter)
app.listen(config.port);
console.log("FairThread API is live on " + config.port);


