const rp = require('request-promise');
const brands = require('./brands');
const prettyjson = require('prettyjson');
const Product = require('../models/product.js');

function buildRequestOptions(brand, searchType, gender) {
  const base = `http://api.shopstyle.com/api/v2/products?pid='${process.env.SHOPSTYLE_API_KEY}`;
  const limit = '&limit=50';
  const search = `&${searchType}=`;
  const category = `&cat=${gender}`;
  return {
    uri: base + limit + search + brand + category,
    json: true,
  };
}

function saveProduct(item, gender) {
  const product = {};
  const query = { shopstyleId: item.id };
  const brand = item.brand ? item.brand.name : item.brandedName;
  const name = item.unbrandedName || item.brandedName;

  if (item.salePrice) product.salePrice = item.salePrice;
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

  Product.findOneAndUpdate(query, product, { upsert: true, setDefaultsOnInsert: true }, (err, doc) => {
    if (err) { console.log("--- Error, can't save product ---", err); }
    console.log(`>>> Saving or updating ${product.brand} | ${product.name} | ${product.price} | ${product.gender}`);
  });
}

function saveProducts(resp) {
  const gender = resp.metadata.category.id === 'womens-clothes' ? 'womens' : 'mens';
  resp.products.forEach((product) => {
    if (product.brand || product.brandName) {
      saveProduct(product, gender);
    }
  });
}

function addProducts(dataSource, searchType, gender) {
  dataSource.forEach((brand) => {
    rp(buildRequestOptions(brand, searchType, gender))
      .then((resp) => {
        saveProducts(resp);
      })
      .catch((err) => {
        console.log('--- Error, caught in promise ---', err);
      });
  });
}

addProducts(brands.brandsById, 'fl', 'womens-clothes');
addProducts(brands.brandsBySearch, 'fts', 'womens-clothes');
addProducts(brands.brandsById, 'fl', 'men');
addProducts(brands.brandsBySearch, 'fts', 'men');
