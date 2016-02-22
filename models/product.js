
var morgan = require('morgan');
var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var ProductSchema = new Schema({
  name: {type:String,required: true, unique:true},
  brand: {type:String,required: true},
  price: {type:Number,min:0, required:true},
  vendUrl: {type:String, required:true},
  imageLarge: {type:String, required: true},
  imageSmall: {type:String, required: true},
  imageOriginal: {type:String, required: true},
  category: {type:String, required: true},
  description: {type:String},
  color: {type:String},
  gender: {type:String}
})

var Product = mongoose.model('Products', ProductSchema);
module.exports = Product
