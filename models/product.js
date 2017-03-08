
var morgan = require('morgan');
var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var ProductSchema = new Schema({
  shopstyleId: { type: Number, unique: true },
  name: { type: String, required: true, default: '' },
  brand: { type: String },
  price: { type: Number, min: 0 },
  salePrice: { type: Number, default: 0 },
  vendUrl: { type: String },
  imageLarge: { type: String },
  imageSmall: { type: String },
  imageOriginal: { type: String },
  category: { type: String },
  categories: { type: Array },
  fairThreadsCategory: { type: String, default: 'No category' },
  description: { type: String },
  color: { type: String },
  gender: { type: String },
  softDelete: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  activeTimeStamp: { type: Date },
  new: { type: Boolean },
  style: { type: String },
  categoryRank: { type: Number },
  objectFit: { type: String, default: "contain" },
  stylistPick: { type: Boolean, default: false }
}, {
  timestamps: true
})

var Product = mongoose.model('Products', ProductSchema);
module.exports = Product
