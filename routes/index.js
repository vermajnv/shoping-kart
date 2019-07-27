var express = require('express');
var csrf = require('csurf');
var Product = require('../models/product');
var passport = require('passport');
var router = express.Router();
var {check, validationResult} = require('express-validator');

var csrfProtection = csrf();
router.use(csrfProtection);
/* GET home page. */
router.get('/', function(req, res, next) {
   Product.find((error, data) => {
      let productChunk = [];
      for(i = 0; i < data.length; i += 3)
      {
         productChunk.push(data.slice(i, i + 3));
      }
      res.render('shop/index', { title: 'Shopping Kart', productChunks : productChunk});
   })
});

router.get('/user/signup', (req, res, next) => {
   let messages = req.flash('error');
   res.render('user/signup', {csrfToken : req.csrfToken(), messages : messages, dataCount : messages.length > 0});
});

router.post('/user/signup',
   [
      check('email').isEmail().withMessage("A valid email is required"),
      check('password').isLength({ min: 5 }).withMessage('Password should be at least char'),
   ],
   passport.authenticate('local.signup', {
   successRedirect : '/profile',
   failureRedirect : '/user/signup',
   failureFlash : true,
}));

router.get('/profile', function(req, res, next) {
   res.render('user/profile');
});

router.get('/user/signin', (req, res, next) => {
   let messages = req.flash('error');
   res.render('user/signin', {csrfToken : req.csrfToken(), messages : messages, dataCount : messages.length > 0} );
});

router.post('/user/signin',
   [
      check('email').isEmail().withMessage('A valid Email is required'),
      check('password').not().isEmpty().withMessage('Password field can not be empty'),
   ],
   passport.authenticate('user.signin', {
      successRedirect : '/profile',
      failureRedirect : '/user/signin',
      failureFlash : true,
}));
module.exports = router;
