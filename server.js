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
      products.find({softDelete:false},function(err,products) {
      if(err) {
        res.send(err);
      }
      else {
        res.render('admin/index', {
          products: products
        })
      }
    })
  })
  .put(function(req,res) {

    // console.log(req.body.arrayIds)

    var data = JSON.parse(req.body.arrayIds)
    for(var i=0; i < data.length; i ++) {
      products.findById(data[i], function(err, product) {
          product.softDelete = true
          product.save(function(err) {
            if(err) res.send(err)
              console.log(product)
          })

      })
    }
    res.json({message : 'success'})

  })


    // products.findById( id, function(err, product) {
    //   if(id) product.softDelete = true
    //     product.save(function(err) {
    //     if(err) res.send(err)
    //       res.redirect('/admin')
    //   })
    // })


adminRouter.route('/product/:product_id')
  .get(function(req,res) {
      var id = req.params.product_id
      products.findById(id, function(req, product) {
        res.render('admin/product', {
          product: product
        })
      })
      // console.log(req)
  })
  .put(function(req,res) {
    var newId = req.params.product_id
    products.findById(newId, function(err, product) {
      // console.log(req.body.name)

      if (req.body.name) {product.name = req.body.name }
      if (req.body.description) product.description = req.body.description;
      if (req.body.vendUrl) product.vendUrl = req.body.vendUrl;
      if (req.body.category) product.category = req.body.category;
      product.save(function(err) {
        if(err) res.send(err)
          res.redirect('/admin')

      })
      console.log(product)
    })

  })

  adminRouter.route('/products')
    .get(function(req, res) {
      res.render('admin/products.ejs')
    })

  adminRouter.route('/product-lists')
    .get(function(req, res) {
      products.find(function(err, product) {
        if(err) {
          res.send(err);
        }

        var productLists = {
          womensCategories: {},
          mensCategories: {},
          womensProducts: [],
          mensProducts: [],
          allProducts: [],
        }

        product.map(function(item) {
          productLists.allProducts.push(item)
          if(item.gender === 'womens-clothes') {
            productLists.womensProducts.push(item)
            console.log('here', productLists.womensCategories.hasOwnProperty(item.category))
            productLists.womensCategories.hasOwnProperty(item.category) ? productLists.womensCategories[item.category].push(item) : productLists.womensCategories[item.category] = [item]
          } else if(item.gender === 'men') {
            productLists.mensProducts.push(item)
            productLists.mensCategories.hasOwnProperty(item.category) ? productLists.mensCategories[item.category].push(item) : productLists.mensCategories[item.category] = [item]
          }
        })
        res.json(productLists)
      })
    })
    .put(function(req, res) {
      var data = JSON.parse(req.body.data)
      products.find({softDelete: false}, function(err, product) {
        if(err) {
          res.send(err);
        }
        product.map(function(item) {
          if(data[item._id]) {
            item.gender = data[item._id]
            item.save(function(err) {
              if(err) res.send(err)
            })
          }
        })
      })
      res.send('sent')
    })

  adminRouter.route('/categories')
    .get(function(req, res) {
      products.find({softDelete:false}, function(err, product) {
        if(err) {
          res.send(err);
        }
        var categories = {}
        product.map(function(item) {
          if(categories.hasOwnProperty(item.category)) {
            return categories[item.category].push(item)
          } else {
            return categories[item.category] = [item]
          }
        })
        // console.log('Categories', categories)
        res.render('admin/categories.ejs', {
          shopStyleCategories: categories
        })

      })
    })
    .put(function(req, res) {
      var data = JSON.parse(req.body.data)
      // console.log("keys", Object.keys(data))
      var shopStyleCategories = data.shopStyleCategories;
      // console.log('selections', shopStyleCategories)
      var fairThreadsCategory = data.fairThreadsCategory;
      products.find({softDelete: false}, function(err, product) {
        product.forEach(function(item) {
          shopStyleCategories.forEach(function(category) {
            if(item.category === category) {
              item.fairThreadsCategory = fairThreadsCategory;
              item.save(function(err) {
                if(err) res.send(err)
              })
            }
          })
        })
      })
      res.send("fairThreadsCategory assigned")
    })






app.use('/api', apiRouter);
app.use('/admin', adminRouter)
app.listen(config.port);
console.log("FairThread API is live on " + config.port);
