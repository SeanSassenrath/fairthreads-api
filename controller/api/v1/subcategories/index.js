const express = require('express');
const { subcategoriesCtrl } = require('./subcategoriesController');

const subcategories = express.Router();

subcategories.use((req, res, next) => {
  next();
});

subcategories.get('/', subcategoriesCtrl.getSubcategories);
subcategories.get('/:id', subcategoriesCtrl.getSubcategory);
subcategories.post('/', subcategoriesCtrl.postSubcategory);
subcategories.delete('/:id', subcategoriesCtrl.deleteSubcategory);
subcategories.put('/:id', subcategoriesCtrl.updateSubcategory);

module.exports = subcategories;
