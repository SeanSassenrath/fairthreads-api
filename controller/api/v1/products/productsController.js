const Product = require('../../../../models/product');
const { isEmpty } = require('lodash');
const mongoose = require('mongoose');

const filterProductsByBrand = (products, req, res) => {
  if (!(req.query).isEmpty) {
    const filteredProducts = products.filter(product => (
      product.brand !== null
    ));
    res.send(filteredProducts);
  }
  res.send(products);
};

const productsCtrl = {

  getProducts(req, res) {
    const {
      cat,
      subcat,
      brand,
    } = req.query;

    Product.find({})
      .populate('categories')
      .populate({
        path: 'brand',
        match: { 'details.name': brand },
      })
      .then((products) => {
        filterProductsByBrand(products, req, res);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  getProduct(req, res) {
    Product.findById(req.params.id)
      .populate('categories')
      .then((product) => {
        res.send(product);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  postProduct(req, res) {
    const newProduct = new Product(req.body);
    newProduct.save((err, product) => {
      if (err) res.send(err);
      res.json({ message: 'Product added', product });
    });
  },

  deleteProduct(req, res) {
    Product.remove({ _id: req.params.id }, (err, result) => {
      res.json({ message: 'Product deleted', result });
    });
  },

  updateProduct(req, res) {
    Product.findById({ _id: req.params.id })
      .then((product) => {
        Object.assign(product, req.body).save((err, savedProduct) => {
          if (err) res.send(err);
          res.json({ message: 'Product updated', product });
        });
      })
      .catch((err) => {
        res.send(err);
      });
  },
};

module.exports = { productsCtrl };
