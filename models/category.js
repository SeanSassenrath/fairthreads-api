
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  metadata: {
    softDelete: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  details: {
    name: { type: String, required: true, default: '' },
    description: { type: String },
    // gender: { type: String } - do we want to have gender here?
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  subcategories: [{ type: Schema.Types.ObjectId, ref: 'Subcategory' }],
  // subcategories: Needs to be its own Collection - populate it
}, {
  timestamps: true,
});


module.exports = mongoose.model('Category', categorySchema);
