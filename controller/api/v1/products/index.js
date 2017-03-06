const express = require('express');
const { productCtrl } = require('./productController.js');

const products = new express.Router();

products.use((req, res, next) => {
  next();
});

products.get('/products', productCtrl.getProducts);

module.exports = products;
