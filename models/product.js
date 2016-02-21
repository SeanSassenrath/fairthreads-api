
var morgan = require('morgan');
var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var ProductSchema = new Schema({
  name: {type:String,required: true},
  brand: {type:String,required: true},
  price: {type:Number,min:0, required:true},
  vendUrl: {type:String, required:true   }

})

var Product = mongoose.model('Products', ProductSchema);
module.exports = Product
