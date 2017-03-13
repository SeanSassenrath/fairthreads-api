const Product = require('../../models/product');

const deletedProducts = [];
const now = new Date();
const twoDays = (1000 * 60 * 60 * 24 * 3);
const updateCutOff = new Date(now - twoDays);
console.log('--- updateCutOff', updateCutOff);

const cleanDb = () => {
  Product.remove({ updatedAt: { $lte: new Date(updateCutOff) } })
    .then(products => (
      console.log('products', products)
      // products.map(product => (
      //   console.log('product', product.updateAt)
      // ))
    ))
    .catch((err) => {
      console.log('ERROR', err);
    });
};

module.exports = { cleanDb };

