var Product = require('../../models/product');

module.exports = function(app, express) {
  var productsRouter = express.Router();

  productsRouter.use(function(req, res, next) {
    // console.log("API was just hit by", req)
    next()
  })

  productsRouter.get('/gender/:gender/category/:category', function(req, res) {
    var products = {};
    console.log("ANYTHING?")

    Product.find({softDelete: false, gender: req.params.gender, fairThreadsCategory: req.params.category}, function(err, matchedProducts){
      if(err) {
        console.log('error', err)
        res.send(err)
      } else {
        products.items = matchedProducts;
        console.log('products', products.items)
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
