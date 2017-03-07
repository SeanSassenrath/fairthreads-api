const Product = require('../../../../models/product');

const productsCtrl = {

  getProducts(req, res) {
    const query = Product.find({});
    query.exec((err, products) => {
      if (err) res.send(err);
      res.json(products);
    });
  },
};

module.exports = { productsCtrl };
