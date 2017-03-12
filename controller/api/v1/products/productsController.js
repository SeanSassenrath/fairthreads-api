const Product = require('../../../../models/product');
const { isEmpty } = require('lodash');
const mongoose = require('mongoose');

const productsQueryFilter = (req, res) => {
  if (!isEmpty(req.query) && req.query.gender !== undefined) {
    return ({ 'details.gender': req.query.gender });
  }
  return {};
};

const filterProductsByBrand = (products, req, res) => {
  if (!isEmpty(req.query.brand)) {
    const filteredProducts = products.filter(product => (
      product.brand !== null
    ));
    return filteredProducts;
  }
  return products;
};

const productsCtrl = {

  getProducts(req, res) {
    const {
      cat,
      subcat,
      brand,
    } = req.query;

    const filter = productsQueryFilter(req, res);

    Product.find(filter)
      .populate('categories')
      .populate({
        path: 'brand',
        match: { 'details.name': brand },
      })
      .then((products) => {
        const filteredProducts = filterProductsByBrand(products, req, res);
        res.send(filteredProducts);
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
