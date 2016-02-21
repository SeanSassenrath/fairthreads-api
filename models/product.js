
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



var fancyTop = new Product({
  name: 'Alice Sweater',
  brand: 'Reformation',
  price: 49.99,
  vendUrl: 'http://www.shopreformation.com'
})

module.exports = {
  saveTop: function() {
    fancyTop.save(function (err) {if (err) console.log (err)})
  }

}




// module.exports = mongoose.model('Product', ProductSchema);
