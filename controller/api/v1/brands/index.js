const express = require('express');
const { brandsCtrl } = require('./brandsController');

const brands = express.Router();

brands.use((req, res, next) => {
  next();
});

brands.get('/', brandsCtrl.getBrands);
brands.get('/:id', brandsCtrl.getBrand);
brands.post('/', brandsCtrl.postBrand);
brands.delete('/:id', brandsCtrl.deleteBrand);
brands.put('/:id', brandsCtrl.updateBrand);

module.exports = brands;
