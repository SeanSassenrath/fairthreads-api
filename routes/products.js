var Product = require('../models/product');

module.exports = function(app, express) {
  var productsRouter = express.Router();

  productsRouter.use(function(req, res, next) {
    console.log("API was just hit by", req)
    next()
  })

  productsRouter.get('/less-than-fifty', function(req, res) {
    Product.find({price: {$lt: 50}}, function(err, products) {
      err ? res.send(err) : res.json(products)
    })
  })

  return productsRouter;
}
