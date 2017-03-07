const express = require('express');
const { productsCtrl } = require('./productsController');

const products = new express.Router();

products.use((req, res, next) => {
  next();
});

products.get('/products', productsCtrl.getProducts);

module.exports = products;
