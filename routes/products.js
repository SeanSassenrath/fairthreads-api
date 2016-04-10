var Product = require('../models/product');

module.exports = function(app, express) {
  var productsRouter = express.Router();

  productsRouter.use(function(req, res, next) {
    // console.log("API was just hit by", req)
    next()
  })

  productsRouter.get('/gender/:gender', function(req, res) {
    var products = {};

    var assignCategories = function(items) {
      var categories = [];
        items.forEach(function(item) {
          if(categories.indexOf(item.fairThreadsCategory) < 0 && item.fairThreadsCategory != undefined) categories.push(item.fairThreadsCategory)
        })
      return categories;
    }

    Product.find({gender: req.params.gender}, function(err, productsByGender){
      if(err) {
        res.send(err)
      } else {
        products.items = productsByGender;
        products.categoryList = assignCategories(productsByGender);
        res.json(products);
      }
    })
  })

  productsRouter.get('/less-than-fifty', function(req, res) {
    Product.find({price: {$lt: 50}}, function(err, products) {
      err ? res.send(err) : res.json(products)
    })
  })

  return productsRouter;
}
