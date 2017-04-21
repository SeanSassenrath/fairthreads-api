const { isEmpty } = require('lodash');

const productsHelpers = {

  productsQueryFilter(brand, category, req) {
    const query = {};
    const { gender, gtPrice, ltPrice } = req.query;
    if (!isEmpty(req.query)) {
      if (gender) { query['details.gender'] = gender; }
      if (gtPrice) { query['prices.price'] = { $gt: gtPrice }; }
      if (ltPrice) { query['prices.price'] = { $lt: ltPrice }; }
      if (brand) { query['brand._id'] = brand._id; }
      if (category) { query['category._id'] = category._id; }
    }
    return query;
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
