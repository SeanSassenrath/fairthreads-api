const Product = require('../../../../models/product');
const mongoose = require('mongoose');
const {
  productsQueryFilter,
  filterProductsByBrand,
  populateBrands,
  filterProductsByCategory,
  populateCategories,
} = require('./productsHelpers');

const productsCtrl = {

  getProducts(req, res) {
    const productsFilter = productsQueryFilter(req, res);

    const { brand } = req.query;
    const brands = populateBrands(brand, req);

    const { category } = req.query;
    const categories = populateCategories(category, req);

    Product.find(productsFilter)
      .populate(categories)
      .populate(brands)
      .then((products) => {
        const filteredProducts = filterProductsByBrand(products, req, res);
        console.log('Filtered by brand', filteredProducts)
        return filteredProducts;
      })
      .then((products) => {
        const filteredProducts = filterProductsByCategory(products, req, res);
        console.log('Filtered by category', filteredProducts);
        return filteredProducts;
      })
      .then((products) => {
        res.send(products);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  getProduct(req, res) {
    Product.findById(req.params.id)
      .populate('categories')
      .then((product) => {
        res.send(product);
      })
      .catch((err) => {
        res.send(err);
      });
  },

  postProduct(req, res) {
    const newProduct = new Product(req.body);
    newProduct.save((err, product) => {
      if (err) res.send(err);
      res.json({ message: 'Product added', product });
    });
  },

  deleteProduct(req, res) {
    Product.remove({ _id: req.params.id }, (err, result) => {
      res.json({ message: 'Product deleted', result });
    });
  },

  updateProduct(req, res) {
    Product.findById({ _id: req.params.id })
      .then((product) => {
        Object.assign(product, req.body).save((err, savedProduct) => {
          if (err) res.send(err);
          res.json({ message: 'Product updated', product });
        });
      })
      .catch((err) => {
        res.send(err);
      });
  },
};

module.exports = { productsCtrl };
