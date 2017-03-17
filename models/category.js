
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  metadata: {
    catId: { type: Number, required: true, unique: true },
    softDelete: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  details: {
    name: { type: String, required: true, default: '' },
    description: { type: String },
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  subcategories: [{ type: Schema.Types.ObjectId, ref: 'Subcategory' }],
}, {
  timestamps: true,
});


module.exports = mongoose.model('Category', categorySchema);
