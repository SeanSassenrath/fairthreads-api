const Product = require('../../../../models/product');
const Category = require('../../../../models/category');
const Brand = require('../../../../models/brand');
const mongoose = require('mongoose');
const {
  productsQueryFilter,
  populateBrands,
  populateCategories,
} = require('./productsHelpers');

const productsCtrl = {

  getProducts(req, res) {
    const { page } = req.query;
    const brands = populateBrands(req);
    const categories = populateCategories(req);

    // Use the brand name from req.query to find brand._id
    Brand.find({ 'details.name': req.query.brand })
      .then((brand) => {
        // Use the category name from req.query to find category._id
        return Category.find({ 'details.name': req.query.category })
          .then(category => ({ brand, category }));
      })
      .then((brandAndCategory) => {
        const { brand, category } = brandAndCategory;
        // Use brand, category and other filters from req to find Products
        Product.find(productsQueryFilter(brand, category, req))
          .sort({ updatedAt: -1 })
          .skip(page > 0 ? (Math.ceil(page - 1) * 36) : 0)
          .limit(36)
          .populate(categories)
          .populate(brands)
          .then((products) => {
            res.send(products);
          })
          .catch((err) => {
            res.send(err);
          });
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

  getBrandsFromProducts(req, res) {
    const brands = populateBrands(req);
    // Use the category name from req.query to find category._id
    return Category.find({ 'details.name': req.query.category })
      .then((category) => {
        // Use brand, category and other filters from req to find Products
        Product.find(productsQueryFilter(null, category, req))
          .populate(brands)
          .then((products) => {
            const brandsList = [];
            const brandsCheck = {};
            products.map((product) => {
              if (!brandsCheck[product.brand.details.name]) {
                brandsList.push(product.brand.details.name);
                brandsCheck[product.brand.details.name] = product.brand.details.name;
              }
            });
            res.send(JSON.stringify({ brands: brandsList }));
          })
          .catch((err) => {
            res.send(err);
          });
      });
  },
};

module.exports = { productsCtrl };
