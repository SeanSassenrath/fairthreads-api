const express = require('express');
const { categoriesCtrl } = require('./categoriesController');

const categories = express.Router();

categories.use((req, res, next) => {
  next();
});

categories.get('/', categoriesCtrl.getCategories);
categories.get('/:id', categoriesCtrl.getCategory);
categories.post('/', categoriesCtrl.postCategory);
categories.delete('/:id', categoriesCtrl.deleteCategory);
categories.put('/:id', categoriesCtrl.updateCategory);

module.exports = categories;
