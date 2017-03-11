
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
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
  parentCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
}, {
  timestamps: true,
});


module.exports = mongoose.model('Subcategory', subcategorySchema);
