var prettyjson = require('prettyjson');

module.exports = {
  prettifyJSON: function(json) {
    prettyjson.render(json, {
      keysColor: 'green',
      dashColor: 'white',
      stringColor: 'gray',
      numberColor: 'gray'
    })
  }
}
