var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var {
   check,
   validationResult
} = require('express-validator');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLogedIn, function(req, res, next) {
   res.render('user/profile');
});

router.use('/', notLogedIn, (req, res, next) => {
   next();
});

router.get('/signup', (req, res, next) => {
   let messages = req.flash('error');
   res.render('user/signup', {
      csrfToken: req.csrfToken(),
      messages: messages,
      dataCount: messages.length > 0
   });
});

router.post('/signup',
   [
      check('email').isEmail().withMessage("A valid email is required"),
      check('password').isLength({
         min: 5
      }).withMessage('Password should be at least char'),
   ],
   passport.authenticate('local.signup', {
      successRedirect: '/user/profile',
      failureRedirect: '/user/signup',
      failureFlash: true,
   }));


router.get('/signin', (req, res, next) => {
   let messages = req.flash('error');
   res.render('user/signin', {
      csrfToken: req.csrfToken(),
      messages: messages,
      dataCount: messages.length > 0
   });
});

router.get('/signout', (req, res, next) => {
   req.logout();
   res.redirect('/')
})
router.post('/signin',
   [
      check('email').isEmail().withMessage('A valid Email is required'),
      check('password').not().isEmpty().withMessage('Password field can not be empty'),
   ],
   passport.authenticate('user.signin', {
      successRedirect: '/user/profile',
      failureRedirect: '/user/signin',
      failureFlash: true,
   }));

function isLogedIn(req, res, next) {
   return (req.isAuthenticated() ? next() : res.redirect('/'));
}

function notLogedIn(req, res, next) {
   return (!(req.isAuthenticated()) ? next() : res.redirect('/'));
}
module.exports = router;
