
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;

const brandSchema = new Schema({
  metadata: {
    id: { type: String, unique: true, required: true },
    softDelete: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  details: {
    name: { type: String, required: true, unique: true },
    gender: { type: String, default: 'both' },
    description: { type: String },
    image: { type: String },
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
}, {
  timestamps: true,
});


module.exports = mongoose.model('Brand', brandSchema);
