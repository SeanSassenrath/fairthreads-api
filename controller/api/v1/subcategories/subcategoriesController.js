const Subcategory = require('../../../../models/subcategory');
const mongoose = require('mongoose');


const subcategoriesCtrl = {

  getSubcategories(req, res) {
    const {
      cat,
      product,
    } = req.query;

    Subcategory.find({})
      .populate('parentCategory')
      .then((subcategory) => {
        res.send(subcategory);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  getSubcategory(req, res) {
    Subcategory.findById(req.params.id)
      .then((subCategory) => {
        res.send(subCategory);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  postSubcategory(req, res) {
    const newSubcategory = new Subcategory(req.body);
    newSubcategory.save((err, subcategory) => {
      if (err) res.send(err);
      res.json({ message: 'Subcategory added', subcategory });
    });
  },

  deleteSubcategory(req, res) {
    Subcategory.remove({ _id: req.params.id }, (err, result) => {
      res.json({ message: 'Subcategory deleted', result });
    });
  },

  updateSubcategory(req, res) {
    Subcategory.findById({ _id: req.params.id })
      .then((subcategory) => {
        Object.assign(subcategory, req.body).save((err, savedSubcategory) => {
          if (err) res.send(err);
          res.json({ message: 'Subcategory updated', subcategory });
        });
      })
      .catch((err) => {
        res.send(err);
      });
  },
};

module.exports = { subcategoriesCtrl };
