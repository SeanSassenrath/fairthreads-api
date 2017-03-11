const mongoose = require('mongoose');
const categories = require('./category');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  shopstyleId: { type: Number, unique: true },
  metadata: {
    softDelete: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  details: {
    name: { type: String, required: true, default: '' },
    brand: { type: String }, // Needs to be its own Collection - populate it
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
  styles: {
    objectFit: { type: String, default: 'contain' },
  },
  categories: [{ type: Number, ref: categories.Schema }],
  //attributes: Needs to be its own Collection - populate it
    // color goes under attributes
    // stylistPick goes under attributes
}, {
  timestamps: true,
});

// ProductSchema.pre('save', ((next) => {
//   const now = new Date();
//   if (!this.metadata.createdAt) {
//     this.metadata.createdAt = now;
//   }
//   next();
// }));

// ProductSchema.pre('findOneAndUpdate', ((next) => {
//   const now = new Date();
//   console.log('This', this)
//   next();
// }));

module.exports = mongoose.model('Product', productSchema);
