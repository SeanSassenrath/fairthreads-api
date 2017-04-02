const rp = require('request-promise');
const brands = require('./brands');
const prettyjson = require('prettyjson');
const Product = require('../../models/product');
const Brand = require('../../models/brand');
const Category = require('../../models/category');
const categoryAssignment = require('./categories');

const shopstyleSubCategories = {};

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

  product.brand = item.brandId;
  product.categories = item.categoryId;

  product.details.gender = item.gender;
  product.details.name = name;
  product.details.description = item.description;
  product.details.vendUrl = item.clickUrl;

  product.prices.price = item.price;

  product.images.imageLarge = item.image.sizes.Large.url;
  product.images.imageSmall = item.image.sizes.Small.url;
  product.images.imageOriginal = item.image.sizes.Original.url;

  return Product.findOneAndUpdate({ shopstyleId: item.id }, product, { upsert: true, setDefaultsOnInsert: true, new: true })
    .then((savedProduct) => {
      // console.log(`>>> Saving or updating ${product.details.name} | ${product.prices.price} | ${product.details.gender}`);

      console.log('product.brand', product.brand)
      console.log('savedProduct.id', savedProduct.id)
      Brand.update({ _id: product.brand }, { $push: { products: savedProduct.id } })
        .then((brandWithProduct) => {
          console.log("brandWithProduct", brandWithProduct);
        })
        .catch((err) => {
          if (err) { console.log("--- Error, can't save product to brand", err); }
        });

      return savedProduct;
    })
    .then((savedProduct) => {
      Category.update({ _id: product.categories }, { $push: { products: savedProduct.id } })
        .then((categoryWithProduct) => {
          // console.log('categoryWithProduct', categoryWithProduct);
        })
        .catch((err) => {
          if (err) { console.log("--- Error, can't save product to category", err); }
        });
    })
    .catch((err) => {
      if (err) { console.log("--- Error, can't save product ---", err); }
    });
}

const saveBrand = (item) => {
  const shopstyleBrandName = item.brand ? item.brand.name : item.brandedName;
  const brand = { details: { name: shopstyleBrandName } };

  return Brand.findOneAndUpdate({ 'details.name': shopstyleBrandName }, brand, { upsert: true, new: true, setDefaultsOnInsert: true })
    .catch((err) => {
      console.log(`--- Error, can't save brand ${err}`);
    });
};

const findBrand = (item) => {
  const shopstyleBrandName = item.brand ? item.brand.name : item.brandedName;
  const brand = { details: { name: shopstyleBrandName } };

  return Brand.find({ 'details.name': shopstyleBrandName })
    .then((foundBrand) => {
      const brandedItem = item;
      console.log('foundBrand', foundBrand);
      brandedItem.brandId = foundBrand[0]._id;
      return brandedItem;
    })
    .catch((err) => {
      console.log(`--- Error, can't save brand ${err}`);
    });
};

const saveCategory = (item) => {
  const shopstyleCategoryId = item.categories[0].id;
  const category = categoryAssignment[shopstyleCategoryId];
  console.log('--- category here', category);

  // if (!ssCategories[item.categories[0].id]) {
  //   ssCategories[item.categories[0].id] = 1;
  // } else if (ssCategories[item.categories[0].id]) {
  //   ssCategories[item.categories[0].id] = ssCategories[item.categories[0].id] + 1;
  // }

  return Category.findOneAndUpdate({ 'metadata.catId': category.id }, category, { upsert: true, new: true, setDefaultsOnInsert: true })
    .catch((err) => {
      console.log(`--- Error, can't save category ${err}`);
    });
};

const findCategory = (item) => {
  const test = item.categories[0].id;
  const category = categoryAssignment[test];

  // if (!ssCategories[item.categories[0].id]) {
  //   ssCategories[item.categories[0].id] = 1;
  // } else if (ssCategories[item.categories[0].id]) {
  //   ssCategories[item.categories[0].id] = ssCategories[item.categories[0].id] + 1;
  // }

  return Category.find({ 'metadata.catId': category.metadata.catId })
    .then((savedCategory) => {
      const categorizedItem = item;
      categorizedItem.categoryId = savedCategory[0]._id;
      return categorizedItem;
    })
    .catch((err) => {
      console.log(`--- Error, can't find category ${err}`);
    });
};

function addProducts(dataSource, searchType, gender) {
  dataSource.forEach((brand) => {
    rp(buildRequestOptions(brand, searchType, gender))
      .then((resp) => {
        resp.products.map(product => (
          saveBrand(product)
        ));
        return resp;
      })
      .then((resp) => {
        resp.products.map(product => (
          saveCategory(product)
        ));
        return resp;
      })
      .then((resp) => {
        const productGender = resp.metadata.category.id === 'womens-clothes' ? 'womens' : 'mens';
        const productsWithGender = resp.products.map((product) => {
          const shopstyleProduct = product;
          shopstyleProduct.gender = productGender;
          return shopstyleProduct;
        });
        return productsWithGender;
      })
      .then((productsWithGender) => {
        return Promise.all(productsWithGender.map((product) => {
          return findBrand(product);
        }));
      })
      .then((productsWithBrand) => {
        return Promise.all(productsWithBrand.map(product => (
          findCategory(product)
        )));
      })
      .then((productsWithCategory) => {
        console.log('Products with Category', productsWithCategory);
        productsWithCategory.map(product => (
          saveProduct(product)
        ));
      })
      // .then((brandedProducts) => {
      //   return Promise.all(brandedProducts.map((product) => {
      //     return saveCategory(product);
      //   }));
      // })
      // .then((categorizedProducts) => {
      //   console.log('-- product', categorizedProducts);
      //   return Promise.all(categorizedProducts.map((product) => {
      //     return saveProduct(product);
      //   }));
      // })
      // .then((finishedProduct) => {
      //   console.log('---- finished product', finishedProduct);
      // })
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
