const express = require('express');
const { productsCtrl } = require('./productsController');

const products = new express.Router();

products.use((req, res, next) => {
  next();
});

products.get('/', productsCtrl.getProducts);
products.get('/:id', productsCtrl.getProduct);
products.put('/:id', productsCtrl.updateProduct);

module.exports = products;
