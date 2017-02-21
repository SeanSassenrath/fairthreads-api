var products = require('../../models/product');
var internalCategories = require('./src/categories');

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = function(app, express) {
  var adminRouter = express.Router();

  adminRouter.use(function(req,res,next) {
    next();
  })

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
      var data = JSON.parse(req.body.arrayIds)
      for(var i=0; i < data.length; i ++) {
        products.findById(data[i], function(err, product) {
            product.softDelete = true
            product.save(function(err) {
              if(err) res.send(err)
            })

        })
      }
      res.json({message : 'success'})
    })

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
      var newId = req.params.product_id
      products.findById(newId, function(err, product) {
        if (req.body.name) {product.name = req.body.name }
        if (req.body.description) product.description = req.body.description;
        if (req.body.vendUrl) product.vendUrl = req.body.vendUrl;
        if (req.body.category) product.category = req.body.category;
        product.save(function(err) {
          if(err) res.send(err)
            res.redirect('/admin')

        })
      })

    })

    adminRouter.route('/products')
      .get(function(req, res) {
        res.render('admin/products.ejs')
      })

    adminRouter.route('/product-list')
      .get(function(req, res) {
        var active = req.query.active;
        var gender = req.query.gender;
        var category = req.query.category;
        var stylistPick = req.query.stylistPick;
        var productsWithCategories = {
          products: []
        };

        if(category) {
          products.find({ softDelete: false, gender: gender, fairThreadsCategory: category }, function(err, productList) {
            if(err) {
              res.send(err);
            }
            productList.map(function(product) {
              var categories = Object.keys(internalCategories[gender]);
              product['categories'] = categories;
              productsWithCategories.products.push(product)
            })
            res.json(productsWithCategories)
          })
        } else if(stylistPick === 'true') {
          products.find({ softDelete: false, gender: gender, stylistPick: true }, function(err, productList) {
            if(err) {
              res.send(err);
            }
            productList.map(function(product) {
              var categories = Object.keys(internalCategories[gender]);
              product['categories'] = categories;
              productsWithCategories.products.push(product)
            })
            res.json(productsWithCategories)
          })
        // Currently used by mobile web app client
        } else if (active === 'false') {
          products.find({ active: false, softDelete: false, gender: gender }, function(err, productList) {
            if(err) {
              res.send(err);
            }
            res.json(productList)
          })
        } else {
          products.find({softDelete: false, gender: gender }, function(err, productList) {
            if(err) {
              res.send(err);
            }
            console.log('productList', productList)
            productList.map(function(product) {
              var categories = Object.keys(internalCategories[gender]);
              product['categories'] = categories;
              productsWithCategories.products.push(product)
            })
            res.json(productsWithCategories)
          })
        }
      })

    adminRouter.route('/product-lists/edit')
      .put(function(req, res) {
        var data = JSON.parse(req.body.data)

        products.findOne({_id: data.id}, function(err, product) {
          if(err) {
            res.send(err)
          }
          if(data['objectFit']) {
            product.objectFit = data['objectFit']
          }
          if(data['gender']) { product.gender = data['gender'] }
          if(data['category']) { product.fairThreadsCategory = data['category'] }
          if(data['name'] != product.name) { product.name = data['name'] }
          if(data['active'] !== undefined) { product.active = data['active'] }
          if(data['activeTimeStamp']) { product.activeTimeStamp = data['activeTimeStamp'] }
          if(data['stylistPick'] !== undefined) { product.stylistPick = data['stylistPick'] }

          product.save(function(err) {
            if(err) { console.log("ERROR", err); };
          })
        })
        res.json({'message': 'Product edit saved'});
      })

    adminRouter.route('/product-lists/delete')
      .put(function(req, res) {
        var id = JSON.parse(req.body.id);
        products.findById({ _id : id }, function(err, product) {
          if (err) res.send(err);

          product.softDelete = true;
          product.save(function(err) {
            if (err) res.send(err);
          })
        })
      })

    adminRouter.route('/product-list/random/:gender/:active')
      .get(function(req, res) {
        var active = JSON.parse(req.params.active);
        var gender = req.params.gender;

        products.find({active: active, gender: gender, softDelete: false}, function(err, productList) {
          if (err) res.send(err);

          var shuffledProducts = shuffle(productList);
          res.json(shuffledProducts)
        })
      })

    adminRouter.route('/categories')
      .get(function(req, res) {
        res.json(Object.keys(internalCategories[req.query.gender]));
      });

    adminRouter.route('/category-view')
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
          res.render('admin/categories.ejs', {
            shopStyleCategories: categories
          })

        })
      })
      .put(function(req, res) {
        var data = JSON.parse(req.body.data)
        var shopStyleCategories = data.shopStyleCategories;
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

  return adminRouter;
}
