
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  metadata: {
    id: { type: Number },
    softDelete: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  details: {
    name: { type: String, required: true, default: '' },
    description: { type: String },
    // gender: { type: String } - do we want to have gender here?
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  // subcategories: Needs to be its own Collection - populate it
}, {
  timestamps: true,
});


module.exports = mongoose.model('category', categorySchema);
