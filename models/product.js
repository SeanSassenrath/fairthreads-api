const mongoose = require('mongoose');
const categories = require('./category');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  shopstyleId: { type: Number, unique: true },
  metadata: {
    softDelete: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  details: {
    name: { type: String, required: true, default: '' },
    vendUrl: { type: String },
    description: { type: String },
    gender: { type: String },
  },
  prices: {
    price: { type: Number, min: 0 },
    salePrice: { type: Number, default: 0 },
  },
  images: {
    imageLarge: { type: String },
    imageSmall: { type: String },
    imageOriginal: { type: String },
  },
  css: {
    objectFit: { type: String, default: 'contain' },
  },
  brand: { type: Schema.Types.Object, ref: 'Brand' },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  subcategories: [{ type: Schema.Types.ObjectId, ref: 'Subcategories' }],
  //attributes: Needs to be its own Collection - populate it
    // color goes under attributes
    // stylistPick goes under attributes?
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
