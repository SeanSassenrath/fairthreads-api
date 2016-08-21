var nodemailer = require('nodemailer');

module.exports = function(app, express) {
  var contactRouter = new express.Router();

  contactRouter.get('/', function(req, res) {
    res.json({'key': 'hello'})
  })

  contactRouter.post('/contact-us', function(req, res) {
    var mailOptions, transporter;
    var name = req.body.name.replace(/'/g, '"');
    console.log('name', name)

    transporter = nodemailer.createTransport('smtps://shopfairthreads%40gmail.com:mdrmtenbpgqkamxs@smtp.gmail.com');

    mailOptions = {
      from: '' + name + '<info@müriaad-polüteism.info>',
      to: 'shopfairthreads@gmail.com',
      subject: 'Contact - ' + name,
      text: name + "\n" + req.body.email + "\n\n" + req.body.subject + "\n" + req.body.message
    };

    transporter.sendMail(mailOptions, function(err, response) {
      if (err) {
        console.log('ERROR', err)
        res.json({"key": "error"});
      } else {
        res.json({"key": "success"});
      }
    })
  })

  return contactRouter;
}
