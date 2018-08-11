const folder = './views/partials';
const fs = require('fs');

module.exports = function(req,res,next){
  var partials = {}

  fs.readdirSync(folder).forEach(file => {
    if (file.endsWith('.html')) {
      name = file.split('.').slice(0, -1).join('.');

      partials[name] = `partials/${ name }`;
    }
  })

  res.locals.partials = partials;

  next();
}
