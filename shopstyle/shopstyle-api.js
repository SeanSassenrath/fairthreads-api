var rp = require('request-promise');
var brands = require('./brands');
var prettyjson = require('prettyjson');
var Product = require('../models/product.js')
var _ = require('lodash');

module.exports = {
  addProducts: addProducts
}

function addProducts() {
  addProductsByGender('womens-clothes');
  addProductsBySearch('womens-clothes');
  addProductsByGender('men');
  addProductsBySearch('men');
}

function productUrlGenByBrand(gender, brand) {
  var leftPath = "http://api.shopstyle.com/api/v2/products?pid=" + process.env.SHOPSTYLE_API_KEY + "&limit=50&fl=";
  return leftPath + brand + "&cat=" + gender;
}

function productUrlGenBySearch(gender, brand) {
  var leftPath = "http://api.shopstyle.com/api/v2/products?pid=" + process.env.SHOPSTYLE_API_KEY + "&limit=50&fts=";
  return leftPath + brand + "&cat=" + gender;
}

function addProductsByGender(gender) {
  var brandArray = brands.brandsById;
  brandArray.forEach(function(brand) {
    var url = productUrlGenByBrand(gender, brand);
    // console.log('url', url)
    rp(url)
      .then(function(body) {
        requestProduct(body)
      })
      .catch(function(err) {
        console.log('Error', err);
      })
  })
}

function addProductsBySearch(gender) {
    var brandArray = brands.brandsById;
    brandArray.forEach(function(brand) {
      var url = productUrlGenByBrand(gender, brand);
      // console.log('url', url)
      rp(url)
        .then(function(body) {
          requestProduct(body)
        })
        .catch(function(err) {
          console.log('Error', err);
        })
    })
}

function requestProduct(body) {
  var products = JSON.parse(body).products;
  var gender = JSON.parse(body).metadata.category.id === 'womens-clothes' ? 'womens' : 'mens';

  for (var i = 0; i < products.length; i++) {
    if (products[i].brand || products[i].brandName) {
      saveProduct(products[i], gender);
    }
  }
}


function saveProduct(item, gender) {
  var product = {};
  var query = {'shopstyleId': item.id};
  var brand = item.brand ? item.brand.name : item.brandedName;
  var name = item.unbrandedName || item.brandedName;
  gender = gender || 'womens';

  if(item.salePrice) {
    product.salePrice = item.salePrice;
  }
  product.shopstyleId = item.id;
  product.gender = gender;
  product.name = name;
  product.brand = brand;
  product.price = item.price;
  product.category = item.categories[0].id;
  product.vendUrl = item.clickUrl;
  product.imageLarge = item.image.sizes.Large.url;
  product.imageSmall = item.image.sizes.Small.url;
  product.imageOriginal = item.image.sizes.Original.url;
  product.description = item.description;
  // product.color = item.colors[0].name || "";

  Product.findOneAndUpdate(query, product, {upsert: true, setDefaultsOnInsert: true}, function(err, doc){
      if (err) { console.log("Can't save product", err); }
      if (doc != null) {
        console.log('--- Updating product ---', doc.brand)
      }
  });
}
