var rp = require('request-promise');
var brands = require('./brands');
var prettyjson = require('prettyjson');
var Product = require('../models/product.js')

module.exports = {
  addProducts: fetchProducts
}

function fetchProducts() {
  addProducts(brands.brandsById, 'fl', 'womens-clothes');
  addProducts(brands.brandsBySearch, 'fts', 'womens-clothes');
  addProducts(brands.brandsById, 'fl', 'men');
  addProducts(brands.brandsBySearch, 'fts', 'men');
}

function buildRequestOptions(brand, searchType, gender) {
  var base ="http://api.shopstyle.com/api/v2/products?pid=" + process.env.SHOPSTYLE_API_KEY;
  var limit = "&limit=50";
  var search = "&" + searchType + "=";
  var category = "&cat=" + gender;
  return {
    uri: base + limit + search + brand + category,
    json: true,
  }
}

function addProducts(dataSource, searchType, gender) {
  dataSource.forEach(function(brand) {
    rp(buildRequestOptions(brand, searchType, gender))
      .then(function(resp) {
        saveProducts(resp);
      })
      .catch(function(err) {
        console.log("--- Error, caught in promise ---", err);
      })
  })
}

function saveProducts(resp) {
  var gender = resp.metadata.category.id === 'womens-clothes' ? 'womens' : 'mens';
  resp.products.forEach(function(product) {
    if (product.brand || product.brandName) {
      saveProduct(product, gender);
    }
  });
};

function saveProduct(item, gender) {
  var product = {};
  var query = {'shopstyleId': item.id};
  var brand = item.brand ? item.brand.name : item.brandedName;
  var name = item.unbrandedName || item.brandedName;
  gender = gender || 'womens';

  if (item.salePrice) {
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

  Product.findOneAndUpdate(query, product, {upsert: true, setDefaultsOnInsert: true}, function(err, doc){
      if (err) { console.log("--- Error, can't save product ---", err); }
      console.log(">>> Saving or updating " + product.brand + " | " + product.name + " | " + product.price + " | " + product.gender);
  });
}
