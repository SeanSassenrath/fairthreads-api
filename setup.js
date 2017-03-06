// Creates .env file based on the outline
const fs = require('fs');

fs.createReadStream('.setup-env')
  .pipe(fs.createWriteStream('.env'));
