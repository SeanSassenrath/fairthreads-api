var request = require('request');
var brands = require('./brands').brands;
var prettyjson = require('prettyjson');
var apiKey = require('../config').shopstyleAPIKey
var Product = require('../models/product.js')

// var url = 'http://api.shopstyle.com/api/v2/products/histogram?pid=uid100-33047490-67&filters=Retailer&fts=red+dress';

module.exports = {
  selectBrands: selectBrands,
}

function selectBrands() {
  // var brand;
  var url = "http://api.shopstyle.com/api/v2/products?pid=" + apiKey + "&limit=50&fl=";
  console.log("Querying based on brand")
  brands.forEach(function(brand) {
    requestProduct(url + brand)
  })
}

function requestProduct(url) {
  request(url, function(err, res, body) {
    if(err) {
      console.log("error", err);
    } else {
      var products = JSON.parse(body).products;
      products.forEach(function(product) {
        saveProduct(product)
      })
    }
  })
}

function saveProduct(item) {
    var product = new Product ();
    product.name = item.brandedName;
    product.image = item.image.sizes.Large.url;
    product.price = item.price;
    product.brand = item.brand.name;
    product.vendUrl = item.clickUrl;
    product.save(function(err) {
      if (err) {
        console.log(err)
      }
      else {
        console.log(product)
      }
    })

}
