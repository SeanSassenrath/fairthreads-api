const express = require('express');
const { productsCtrl } = require('./productsController');

const products = new express.Router();

products.use((req, res, next) => {
  next();
});

products.get('/brand-list', productsCtrl.getBrandsFromProducts);

products.get('/', productsCtrl.getProducts);
products.get('/:id', productsCtrl.getProduct);
products.post('/', productsCtrl.postProduct);
products.delete('/:id', productsCtrl.deleteProduct);
products.put('/:id', productsCtrl.updateProduct);


module.exports = products;
