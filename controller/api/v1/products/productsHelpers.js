const { isEmpty } = require('lodash');

const productsHelpers = {

  productsQueryFilter(brand, category, req) {
    // console.log('brand._id', brand[0]._id)
    console.log('category._id', category[0]._id)
    const query = {};
    const { gender, gtPrice, ltPrice } = req.query;
    if (!isEmpty(req.query)) {
      if (gender) { query['details.gender'] = gender; }
      if (gtPrice) { query['prices.price'] = { $gt: gtPrice }; }
      if (ltPrice) { query['prices.price'] = { $lt: ltPrice }; }
      if (brand[0]) { query.brand = brand[0]._id; }
      if (category[0]) { query.categories = category[0]._id; }
    }
    console.log('query', query);
    return query;
  },

  populateBrands(req) {
    if (!isEmpty(req.query.brand)) {
      return {
        path: 'brand',
        match: { 'details.name': req.query.brand },
      };
    }
    return 'brand';
  },

  populateCategories(req) {
    console.log('req.query.category', req.query.category)
    if (!isEmpty(req.query.category)) {
      return {
        path: 'categories',
        match: { 'details.name': req.query.category },
      };
    }
    return 'category';
  },
};

module.exports = productsHelpers;
