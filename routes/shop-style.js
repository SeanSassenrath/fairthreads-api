var request = require('request');
var shopStyleController = require('../controllers/shop-style');
var url = 'https://modulus.io';

module.exports = {
  getProducts: function() {
    request(url, shopStyleController.getProducts)
  }
}
