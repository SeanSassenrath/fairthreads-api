const Product = require('../../../../models/product');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const productsCtrl = {

  getProducts(req, res) {
    Product.find({})
      .then((products) => {
        res.send(products);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  getProduct(req, res) {
    Product.findById(req.params.id)
      .then((product) => {
        res.send(product);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  updateProduct(req, res) {
    Product.findById(req.params.id)
      .then((product) => {
        Object.assign(product, req.body).save((err, savedProduct) => {
          if (err) res.send(err);
          res.json({ message: 'Product updated.' });
        });
      })
      .catch((err) => {
        res.send(err);
      });
  },
};

module.exports = { productsCtrl };
