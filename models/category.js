// Not currently doing anything - will need to set this up when we went to add categories and styles via the admin dashboard

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  gender: { type: String, required: true },
  styles: { type: Array }
})

var Category = mongoose.model('Categories', CategorySchema);
module.exports = Category
