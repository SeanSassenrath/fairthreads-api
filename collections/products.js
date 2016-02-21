var morgan = require('morgan');
var mongoose = require('mongoose');
var Schema =  mongoose.Schema;
var products = require('../models/product.js');
// console.log(Product)

//  var fancyTop = new products({
//   name: 'Alice Sweater',
//   brand: 'Reformation',
//   price: 49.99,
//   vendUrl: 'http://www.shopreformation.com'
// })
// module.exports= {
//   saveItem: function() {
//         fancyTop.save(function (err) {if (err) console.log (err)})
//
//   }
// }
