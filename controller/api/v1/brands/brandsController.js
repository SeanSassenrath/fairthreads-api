const Brand = require('../../../../models/brand');
const { isEmpty } = require('lodash');
const mongoose = require('mongoose');

const filterBrandsByName = (req, res) => {
  if (!isEmpty(req.query)) {
    return {
      'details.name': req.query.name,
    };
  }
  return {};
};

const brandsCtrl = {

  getBrands(req, res) {
    Brand.find(filterBrandsByName(req, res))
      .populate('products')
      .then((brand) => {
        res.send(brand);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  getBrand(req, res) {
    Brand.findById(req.params.id)
      .then((brand) => {
        res.send(brand);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  postBrand(req, res) {
    const newBrand = new Brand(req.body);
    newBrand.save((err, brand) => {
      if (err) res.send(err);
      res.json({ message: 'Brand added', brand });
    });
  },

  deleteBrand(req, res) {
    Brand.remove({ _id: req.params.id }, (err, result) => {
      res.json({ message: 'Brand deleted', result });
    });
  },

  updateBrand(req, res) {
    Brand.findById({ _id: req.params.id })
      .then((brand) => {
        Object.assign(brand, req.body).save((err, savedBrand) => {
          if (err) res.send(err);
          res.json({ message: 'Brand updated', brand });
        });
      })
      .catch((err) => {
        res.send(err);
      });
  },
};

module.exports = { brandsCtrl };
