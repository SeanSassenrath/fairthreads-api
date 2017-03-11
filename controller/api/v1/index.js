const express = require('express');
const products = require('./products');
const categories = require('./categories');

const v1 = new express.Router();

v1.use('/products', products);
v1.use('/categories', categories);

module.exports = v1;
