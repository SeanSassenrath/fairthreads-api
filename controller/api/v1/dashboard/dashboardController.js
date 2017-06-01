const Product = require('../../../../models/product');
const { pullProducts } = require('../../../../utils/shopstyle/shopstyle-api');

const dashboardCtrl = {

  getDashboardInfo(req, res) {
    // message - last pull date / time
    // - total number of products
    // - total number of products per gender / category
  },

  pullProducts(req, res) {
    pullProducts();
    res.json({ message: 'Products pulled successfully' });
    // let preCount;
    // let postCount;

    // Product.count()
    //   .then((count) => {
    //     preCount = count;
    //   })
    //   .then(pullProducts())
    //   .then(Product.count())
    //   .then((count) => {
    //     postCount = 11;
    //   })
    //   .then(() => res.send({ message: { preCount, postCount } }));

    // message - previous number of products, after pull number of products,
  },

  // getCategories(req, res) {
  //   const {
  //     cat,
  //     subcat,
  //     gender,
  //   } = req.query;

  //   Category.find({ $or: [{ 'details.gender': gender }, { 'details.gender': 'both' }] })
  //     .then((category) => {
  //       res.send(category);
  //     })
  //     .catch((err) => {
  //       res.send(err);
  //     });
  // },

};

module.exports = { dashboardCtrl };
