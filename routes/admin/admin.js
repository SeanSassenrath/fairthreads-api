var products = require('../../models/product');
var internalCategories = require('./src/categories');

module.exports = function(app, express) {
  var adminRouter = express.Router();

  adminRouter.use(function(req,res,next) {
    console.log('somebody just came to the admin portal!')
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

    adminRouter.route('/product-list')
      .get(function(req, res) {
        var gender = req.query.gender;
        var category = req.query.category;
        var stylistPick = req.query.stylistPick;
        var productsWithCategories = {
          products: []
        };

        console.log('req sean', req.query)

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
            console.log('stylistPick')

            productList.map(function(product) {
              var categories = Object.keys(internalCategories[gender]);
              product['categories'] = categories;
              productsWithCategories.products.push(product)
            })
            res.json(productsWithCategories)
          })
        } else {
          products.find({ softDelete: false, gender: gender }, function(err, productList) {
            if(err) {
              res.send(err);
            }
            productList.map(function(product) {
              var categories = Object.keys(internalCategories[gender]);
              product['categories'] = categories;
              productsWithCategories.products.push(product)
              console.log('Product with categories', product)
            })
            res.json(productsWithCategories)
          })
        }
      })


    // adminRouter.route('/product-lists')
    //   .get(function(req, res) {
    //     products.find({softDelete: false}, function(err, product) {
    //       if(err) {
    //         res.send(err);
    //       }
    //
    //       var productLists = {
    //         womensCategories: Object.keys(internalCategories.women),
    //         mensCategories: Object.keys(internalCategories.men),
    //         allProducts: [],
    //       }
    //
    //       product.map(function(item) {
    //         productLists.allProducts.push(item)
    //       })
    //       res.json(productLists)
    //     })
    //   })

    adminRouter.route('/product-lists/edit')
      .put(function(req, res) {
        var data = JSON.parse(req.body.data)
        console.log('data', data)

        products.findOne({_id: data.id}, function(err, product) {
          if(err) {
            console.log("ERROR", err);
          }
          if(data['objectFit']) { product.objectFit = data['objectFit'] }
          if(data['gender']) { product.gender = data['gender'] }
          if(data['category']) { product.fairThreadsCategory = data['category'] }
          if(data['name'] != product.name) { product.name = data['name'] }
          if(data['active']) { product.active = data['active'] }
          if(data['activeTimeStamp']) { product.activeTimeStamp = data['activeTimeStamp'] }
          if(data['stylistPick']) { product.stylistPick = data['stylistPick'] }

          product.save(function(err) {
            if(err) { console.log("ERROR", err); };
          })
        })
        res.json({'message': 'Product edit saved'});
      })

    adminRouter.route('/product-lists/delete')
      .put(function(req, res) {
        var data = JSON.parse(req.body.data)
        products.find(function(err, product) {
          if(err) {
            res.send(err);
          }
          product.map(function(item) {
            if(item._id.toString() === data.toString()) {
              item.softDelete = true;
              item.save(function(err) {
                if(err) res.send(err)
              })
            }
          })
        })
        res.message({'message': 'Item softly deleted'})
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

  return adminRouter;
}
