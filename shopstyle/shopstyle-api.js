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
  var gender = ['men', 'womens-clothes'];
  var url = "http://api.shopstyle.com/api/v2/products?pid=" + apiKey + "&limit=50&fl=";
  var counter = 0;
  console.log("Querying based on brand")
    brands.forEach(function(brand) {
      _.times(2, function() {
        requestProduct(url + brand + "&cat=" + gender[counter])
        counter >= 1 ? counter = 0 : counter++;
      })
    })
}

function requestProduct(url) {
  request(url, function(err, res, body) {
    if(err) {
      console.log("error", err);
    } else {
      var products = JSON.parse(body).products;
      var gender = JSON.parse(body).metadata.category.id;
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

  if(item.salePrice) {
    product.salePrice = item.salePrice;
  }
  product.shopstyleId = item.id;
  product.gender = gender;
  product.name = item.brandedName;
  product.brand = item.brand.name;
  product.price = item.price;
  // product.salePrice = item.salePrice;
  product.category = item.categories[0].id;
  product.vendUrl = item.clickUrl;
  product.imageLarge = item.image.sizes.Large.url;
  product.imageSmall = item.image.sizes.Small.url;
  product.imageOriginal = item.image.sizes.Original.url;
  product.description = item.description;
  product.color = item.colors[0].name;

  product.save(function(err) {
    if (err) {
      console.log("Can't save product", err)
    }
    else {
      console.log("Saving product ", product)
    }
  })
}
