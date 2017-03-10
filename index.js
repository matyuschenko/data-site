var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var mailConfig = require('./mail_config');

var port = 3000;

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: mailConfig.service,
    auth: {
        user: mailConfig.user,
        pass: mailConfig.pass
    }
});

// process new message
app.get('/add-source', sendMessage);
app.get('/contact-us', sendMessage);

function sendMessage (req, res) {

    // setup email data with unicode symbols
    var mailOptions = {
        from: mailConfig.from, // sender address
        to: mailConfig.to, // list of receivers
        subject: mailConfig.subject,
        text: JSON.stringify(req.query)
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageIg, info.response);
    });

    res.redirect('/#success');
};

app.use(express.static('build'));
app.listen(port);
console.log('Listening on port ' + port);