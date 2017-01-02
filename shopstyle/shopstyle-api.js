var request = require('request');
var brands = require('./brands');
var prettyjson = require('prettyjson');
var Product = require('../models/product.js')
var _ = require('lodash');

module.exports = {
  addProducts: addProducts
}

function addProducts() {
  // addProductsFromBrand();
  addProductsFromSearch();
}

function addProductsFromBrand() {
  var gender = ['men', 'womens-clothes'];
  var url = "http://api.shopstyle.com/api/v2/products?pid=" + process.env.SHOPSTYLE_API_KEY + "&limit=50&fl=";
  var counter = 0;
  console.log("Querying based on brand")
    brands.brandsById.forEach(function(brand) {
      _.times(2, function() {
        requestProduct(url + brand + "&cat=" + gender[counter])
        counter >= 1 ? counter = 0 : counter++;
      })
    })
}

function addProductsFromSearch() {
  var gender = ['men', 'womens-clothes'];
  var url = "http://api.shopstyle.com/api/v2/products?pid=" + apiKey + "&limit=50&fts=";
  var counter = 0;
    brands.brandsBySearch.forEach(function(brand) {
      _.times(2, function() {
        console.log('---- URL ----', url + brand + "&cat=" + gender[counter])
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
      var gender = JSON.parse(body).metadata.category.id === 'womens-clothes' ?
        'womens'
      :
        'mens';

      products.forEach(function(product) {
        if(product.brand || product.brandedName) {
          saveProduct(product, gender);
        }
      })
    }
  })
}


function saveProduct(item, gender) {
  var product = {};
  var query = {'name': item.brandedName};
  var brand = item.brand ? item.brand.name : item.brandedName;
  gender = gender || 'womens';

  if(item.salePrice) {
    product.salePrice = item.salePrice;
  }
  product.shopstyleId = item.id;
  product.gender = gender;
  product.name = item.brandedName;
  product.brand = brand;
  product.price = item.price;
  product.category = item.categories[0].id;
  product.vendUrl = item.clickUrl;
  product.imageLarge = item.image.sizes.Large.url;
  product.imageSmall = item.image.sizes.Small.url;
  product.imageOriginal = item.image.sizes.Original.url;
  product.description = item.description;
  // product.color = item.colors[0].name;

  Product.findOneAndUpdate(query, product, {upsert: true, setDefaultsOnInsert: true}, function(err, doc){
      if (err) console.log("Can't save product", err);
      console.log('Updating / Saving proudct', doc)
  });
}
