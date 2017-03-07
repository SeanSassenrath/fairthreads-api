const express = require('express');
const products = require('./products');

const v1 = new express.Router();

v1.use('/products/:productid', products);

module.exports = v1;
