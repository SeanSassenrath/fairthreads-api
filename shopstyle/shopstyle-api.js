var request = require('request');
var brands = require('./brands').brands;
var prettyjson = require('prettyjson');
var apiKey = require('../config').shopstyleAPIKey

// var url = 'http://api.shopstyle.com/api/v2/products/histogram?pid=uid100-33047490-67&filters=Retailer&fts=red+dress';

module.exports = {
  selectBrands: selectBrands,
}

function selectBrands() {
  var brand;
  var url = "http://api.shopstyle.com/api/v2/products?pid=" + apiKey + "&limit=5&fl=";
  console.log("Querying based on brand")
  brands.forEach(function(brand) {console.log("sean", requestProduct(url + brand))})
}

function requestProduct(url) {

  request(url, function(err, res, body) {
    if(err) {
      console.log("error", err);
    } else {
      console.log("response code " + res.statusCode);
      console.log(prettyjson.render(JSON.parse(body), {
        keysColor: 'green',
        dashColor: 'white',
        stringColor: 'gray',
        numberColor: 'gray'}));
    }
  })
}
