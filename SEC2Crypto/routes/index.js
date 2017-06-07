var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
Message = mongoose.model('Message');

var crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  key = 'fDiyW}xz/V`+NBuSecretsWillAlwaysBeRevealedFa,dlw*6w}Qw?S6';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    'data': false,
    'err': false
  });
});

router.post('/', function(req, res, next) {
  var data;

  if (req.body.name && req.body.name != '' && req.body.secret && req.body.secret != '' && req.body.password && req.body.password != '') {
    saveMessage(req.body.name, req.body.secret, req.body.password, (result, err) => {
      if (err) {
        renderIndex(res, null, err);
      } else if (result) {
        renderIndex(res, result, null);
      } else {
        renderIndex(res, null, null);
      }
    });
  } else {
    var data = getMessage(req.body.name, req.body.password, (result, err) => {
      if (err) {
        renderIndex(res, null, err);
      } else if (result) {
        renderIndex(res, result, null);
      } else {
        renderIndex(res, null, null);
      }
    });
  }
});

function renderIndex(res, data, err) {
  res.render('index', {
    'data': data,
    'err': err
  });
}

function getMessage(name, password, callback) {
  if (name && password) {

    var query = {
      'name': name,
      'password': password
    };

    var result = Message.findOne(query);

    result
      .then(data => {
        console.log(data);

        if (data) {
          data.secret = decrypt(data.secret);
          callback(data);
        }

        callback(null, 'You entered a wrong name or password.');
      })
      .fail(err => {
        callback(null, err.message);
      });
  }
}

function saveMessage(name, secret, password, callback) {
  var data = {
    'name': name,
    'secret': encrypt(secret),
    'password': password
  };

  console.log(data);

  var message = new Message(data);

  message
    .save()
    .then(savedMessage => {
      callback(savedMessage);
    })
    .fail(err => {
      callback(null, err.message);

      handleError(req, res, 500, err);
    });
}

function encrypt(secret) {
  var cipher = crypto.createCipher(algorithm, key);
  var crypted = cipher.update(secret, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(secret) {
  var decipher = crypto.createDecipher(algorithm, key);
  var dec = decipher.update(secret, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}


module.exports = router;
