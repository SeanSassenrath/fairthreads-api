// Creates .env file based on the outline

'use strict';
var fs = require('fs');
fs.createReadStream('.setup-env')
  .pipe(fs.createWriteStream('.env'));
