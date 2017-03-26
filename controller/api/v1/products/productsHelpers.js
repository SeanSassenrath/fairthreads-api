const { isEmpty } = require('lodash');

const productsHelpers = {

  productsQueryFilter(req, res) {
    const query = {};
    const { gender, gtPrice, ltPrice } = req.query;
    if (!isEmpty(req.query)) {
      if (gender) { query['details.gender'] = gender; }
      if (gtPrice) { query['prices.price'] = { $gt: gtPrice }; }
      if (ltPrice) { query['prices.price'] = { $lt: ltPrice }; }
    }
    return query;
  },

  filterProductsByBrand(products, req, res) {
    if (!isEmpty(req.query.brand)) {
      const filteredProducts = products.filter(product => (
        product.brand !== null
      ));
      return filteredProducts;
    }
    return products;
  },

  populateBrands(brand, req) {
    if (!isEmpty(req.query.brand)) {
      return {
        path: 'brand',
        match: { 'details.name': brand },
      };
    }
    return 'brand';
  },

  filterProductsByCategory(products, req, res) {
    if (!isEmpty(req.query.category)) {
      const filteredCategory = products.filter(product => (
        product.categories !== null
      ));
      return filteredCategory;
    }
    return products;
  },

  populateCategories(category, req) {
    if (!isEmpty(req.query.category)) {
      return {
        path: 'categories',
        match: { 'details.name': category },
      };
    }
    return 'category';
  },
};

module.exports = productsHelpers;
