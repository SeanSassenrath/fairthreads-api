const express = require('express');
const brands = require('./brands');
const categories = require('./categories');
const products = require('./products');
const subcategories = require('./subcategories');
const dashboard = require('./dashboard');

const v1 = new express.Router();

v1.use('/brands', brands);
v1.use('/categories', categories);
v1.use('/products', products);
v1.use('/subcategories', subcategories);
v1.use('/dashboard', dashboard);

module.exports = v1;
