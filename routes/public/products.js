var Product = require('../../models/product');

module.exports = function(app, express) {
  var productsRouter = express.Router();

  productsRouter.use(function(req, res, next) {
    next()
  })

  productsRouter.get('/gender/:gender/category/:category', function(req, res) {
    var products = {};

    Product.find({gender: req.params.gender, fairThreadsCategory: req.params.category}).exec()
      .then(function(matchedProducts) {
        products.items = matchedProducts
        res.json(products);
      })
      .catch(function(err) {
        res.json(err);
      })
  });

  productsRouter.get('/gender/:gender', function(req, res) {
    var products = {};

    Product.find({gender: req.params.gender}).exec()
      .then(function(matchedProducts) {
        products.items = matchedProducts;
        res.json(products);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  productsRouter.get('/stylistpick', function(req, res) {
    var stylistPicks = {};
    var randomIndex;

    Product.find({gender: 'men', stylistPick: true}).exec()
      .then(function(mensPicks) {
        randomIndex = Math.floor(Math.random() * mensPicks.length);
        stylistPicks.men = mensPicks[randomIndex];
      })
      .then(function() {
        return Product.find({gender: 'womens-clothes', stylistPick: true}).exec()
          .then(function(womensPicks) {
            console.log('wpa', womensPicks.length)
            randomIndex = Math.floor(Math.random() * womensPicks.length);
            stylistPicks.women = womensPicks[randomIndex];
            return stylistPicks;
          })
      })
      .then(function(stylistPicks) {
        res.json(stylistPicks)
      })
      .catch(function(e) {
        res.json(e)
      })
  })

  productsRouter.get('/less-than-fifty', function(req, res) {
    Product.find({price: {$lt: 50}}, function(err, products) {
      err ? res.send(err) : res.json(products)
    })
  })

  return productsRouter;
}
