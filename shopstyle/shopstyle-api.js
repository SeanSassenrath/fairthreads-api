var request = require('request');
var brands = require('./brands').brands;
var prettyjson = require('prettyjson');
var apiKey = require('../config').shopstyleAPIKey
var Product = require('../models/product.js')
var _ = require('lodash');

module.exports = {
  addProducts: addProducts
}

function addProducts() {
  var gender = ['mens', 'womens'];
  var url = "http://api.shopstyle.com/api/v2/products?pid=" + apiKey + "&limit=50&fts=&fl=";
  var counter = 0;
  console.log("Querying based on brand")
    brands.forEach(function(brand) {
      _.times(2, function() {
        requestProduct(url + brand + "fts=" + gender[counter], gender[counter])
        counter >= 1 ? counter = 0 : counter++;
      })
    })
}

function requestProduct(url, gender) {
  request(url, function(err, res, body) {
    if(err) {
      console.log("error", err);
    } else {
      var products = JSON.parse(body).products;
        products.forEach(function(product) {
        if(product.brand && product.colors[0]) {
          saveProduct(product, gender);
        }
      })
    }
  })
}


function saveProduct(item, gender) {
  var product = new Product ();

  product.name = item.brandedName;
  product.brand = item.brand.name;
  product.price = item.price;
  product.vendUrl = item.clickUrl;
  product.imageLarge = item.image.sizes.Large.url;
  product.imageSmall = item.image.sizes.Small.url;
  product.imageOriginal = item.image.sizes.Original.url;
  product.category = item.categories[0].id;
  product.description = item.description;
  product.color = item.colors[0].name;
  product.gender = gender.toLowerCase();

  product.save(function(err) {
    if (err) {
      console.log("Can't save product", err)
    }
    else {
      console.log("Saving product ", product)
    }
  })
}
