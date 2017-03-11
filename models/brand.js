
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;

const brandSchema = new Schema({
  metadata: {
    softDelete: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  details: {
    name: { type: String, required: true, default: '' },
    description: { type: String },
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, {
  timestamps: true,
});


module.exports = mongoose.model('Brand', brandSchema);
