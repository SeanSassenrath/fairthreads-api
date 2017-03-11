const Category = require('../../../../models/category');
const mongoose = require('mongoose');

const categoriesCtrl = {

  getCategories(req, res) {
    const {
      cat,
      subcat,
    } = req.query;

    Category.find({})
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  getCategory(req, res) {
    Category.findById(req.params.id)
      .then((category) => {
        res.send(category);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  postCategory(req, res) {
    const newCategory = new Category(req.body);
    newCategory.save((err, category) => {
      if (err) res.send(err);
      res.json({ message: 'Category added', category });
    });
  },

  deleteCategory(req, res) {
    Category.remove({ _id: req.params.id }, (err, result) => {
      res.json({ message: 'Category deleted', result });
    });
  },

  updateCategory(req, res) {
    Category.findById({ _id: req.params.id })
      .then((category) => {
        Object.assign(category, req.body).save((err, savedCategory) => {
          if (err) res.send(err);
          res.json({ message: 'Category updated', category });
        });
      })
      .catch((err) => {
        res.send(err);
      });
  },
};

module.exports = { categoriesCtrl };
