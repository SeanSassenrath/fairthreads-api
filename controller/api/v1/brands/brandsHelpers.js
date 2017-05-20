const { isEmpty } = require('lodash');

const brandsHelper = {

  brandsQueryFilter(category, req) {
    let query = {};
    const { search } = req.query;
    if (!isEmpty(req.query)) {
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
        match: { 'details.name': req.query.brand },
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

module.exports = brandsHelper;
