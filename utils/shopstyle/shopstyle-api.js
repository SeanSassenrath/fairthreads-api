const rp = require('request-promise');
const brands = require('./brands');
const prettyjson = require('prettyjson');
const Product = require('../../models/product');
const Brand = require('../../models/brand');

function buildRequestOptions(brand, searchType, gender) {
  const base = `http://api.shopstyle.com/api/v2/products?pid=${process.env.SHOPSTYLE_API_KEY}`;
  const limit = '&limit=50';
  const search = `&${searchType}=`;
  const category = `&cat=${gender}`;
  return {
    uri: base + limit + search + brand + category,
    json: true,
  };
}

function saveProduct(item, gender) {
  const product = {
    metadata: {},
    details: {},
    prices: {},
    images: {},
  };
  const name = item.unbrandedName || item.brandedName;
  const now = new Date();

  if (item.salePrice) {
    product.prices.salePrice = item.salePrice;
  }

  product.shopstyleId = item.id;
  product.metadata.updatedAt = now;

  product.details.gender = gender;
  product.details.name = name;
  // product.details.brand = brand;
  product.details.description = item.description;
  product.details.vendUrl = item.clickUrl;

  product.prices.price = item.price;

  // product.category = item.categories[0].id;
  product.images.imageLarge = item.image.sizes.Large.url;
  product.images.imageSmall = item.image.sizes.Small.url;
  product.images.imageOriginal = item.image.sizes.Original.url;

  const shopstyleBrandName = item.brand ? item.brand.name : item.brandedName;
  const brand = { details: { name: shopstyleBrandName } };

  Brand.findOneAndUpdate({ 'details.name': shopstyleBrandName }, brand, { upsert: true, setDefaultsOnInsert: true })
    .then((savedBrand) => {
      console.log(`Saved brand ${savedBrand}`);
      product.brand = savedBrand.id;
      Product.findOneAndUpdate({ shopstyleId: item.id }, product, { upsert: true, setDefaultsOnInsert: true, new: true })
        .then((savedProduct) => {
          console.log('savedProduct', savedProduct);
          Brand.update({ 'details.name': shopstyleBrandName }, { $push: { products: savedProduct.id } })
            .catch((err) => {
              if (err) { console.log("--- Error, can't save product to brand", err); }
            });
          console.log(`>>> Saving or updating ${product.brand} | ${product.details.name} | ${product.prices.price} | ${product.details.gender}`);
        })
        .catch((err) => {
          if (err) { console.log("--- Error, can't save product ---", err); }
        });
    })
    .catch((err) => {
      console.log(`--- Error, can't save brand ${err}`);
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

const pullProducts = () => {
  addProducts(brands.brandsById, 'fl', 'womens-clothes');
  addProducts(brands.brandsBySearch, 'fts', 'womens-clothes');
  addProducts(brands.brandsById, 'fl', 'men');
  addProducts(brands.brandsBySearch, 'fts', 'men');
};

module.exports = { pullProducts };