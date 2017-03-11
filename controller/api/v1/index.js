const express = require('express');
const brands = require('./brands');
const categories = require('./categories');
const products = require('./products');
const subcategories = require('./subcategories');

const v1 = new express.Router();

v1.use('/brands', brands);
v1.use('/categories', categories);
v1.use('/products', products);
v1.use('/subcategories', subcategories);

module.exports = v1;
