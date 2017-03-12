const Product = require('../../models/product');

const deletedProducts = [];
const now = new Date();
const twoDays = (1000 * 60 * 60 * 24 * 2);
const updateCutOff = now - twoDays;

const cleanDb = () => {
  Product.find({ updatedAt: { $lt: updateCutOff } })
    .then((product) => {
      if (product.id) {
        Product.findOneAndRemove({ id: product.id })
        .then((deletedProduct) => {
          console.log(`--- Deleting ${deletedProduct.details.name}`);
          deletedProducts.push(product);
        })
        .catch((err) => {
          console.log('ERROR', err);
        });
      } else {
        console.log('--- No products to delete');
      }
    })
    .then(() => {
      console.log(`--- Deleted ${deletedProducts.length}`);
    })
    .catch((err) => {
      console.log('ERROR', err);
    });
};

module.exports = { cleanDb };

