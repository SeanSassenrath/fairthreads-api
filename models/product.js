
var morgan = require('morgan');
var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var ProductSchema = new Schema({
  shopstyleId: {type:Number, required: true, unique: true},
  name: {type:String,required: true},
  brand: {type:String,required: true},
  price: {type:Number,min:0, required:true},
  salePrice: {type:Number},
  vendUrl: {type:String, required:true},
  imageLarge: {type:String, required: true},
  imageSmall: {type:String, required: true},
  imageOriginal: {type:String, required: true},
  category: {type:String, required: true},
  description: {type:String},
  color: {type:String},
  gender: {type:String},
  softDelete: {type: Boolean, required:true, default: false}
})

var Product = mongoose.model('Products', ProductSchema);
module.exports = Product
