const { isEmpty } = require('lodash');

const productsHelpers = {

  productsQueryFilter(brand, category, req) {
    let query = {};
    const { gender, gtPrice, ltPrice, search } = req.query;
    if (!isEmpty(req.query)) {
      if (gender) { query['details.gender'] = gender; }
      if (gtPrice) { query['prices.price'] = { $gt: gtPrice }; }
      if (ltPrice) { query['prices.price'] = { $lt: ltPrice }; }
      if (brand !== null && brand[0]) { query.brand = brand[0]._id; }
      if (category[0]) { query.categories = category[0]._id; }
      if (req.query.category === 'uncategorized') { query.categories = null; }
      if (search) { query = Object.assign(query, { $text: { $search: search } }); }
    }
    return query;
  },

  populateBrands(req) {
    if (!isEmpty(req.query.brand)) {
      return {
        path: 'brand',
        match: { 'metadata.id': req.query.brand },
      };
    }
    return 'brand';
  },

  populateCategories(req) {
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
