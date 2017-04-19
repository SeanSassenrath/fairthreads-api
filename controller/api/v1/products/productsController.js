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
    const { brand, category, page } = req.query;
    const productsFilter = productsQueryFilter(req, res);
    const brands = populateBrands(brand, req);
    const categories = populateCategories(category, req);

    Product
      .find(productsFilter)
      .skip(page > 0 ? ((page - 1) * 30) : 0)
      .limit(30)
      .populate(categories)
      .populate(brands)
      .then((products) => {
        const filteredProducts = filterProductsByBrand(products, req, res);
        console.log('Filtered by brand', filteredProducts);
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
      .populate('brand')
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
      .populate('brand')
      .then((product) => {
        Object.assign(product, req.body).save((err, savedProduct) => {
          res.json({ message: `Update of ${savedProduct.details.name} by ${savedProduct.brand.details.name} was successful!` });
        });
      })
      .catch((err) => {
        console.log('error', err);
        res.json({ message: 'Currently unable to update this product. Please try again later.' });
      });
  },
};

module.exports = { productsCtrl };
