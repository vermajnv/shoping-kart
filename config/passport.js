var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local');
var passport = require('passport');
var {check, validationResult} = require('express-validator');

// Store User in session

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

// Retrive the user from session
passport.deserializeUser(function(id, done) {
   User.findById(id, function(error, user) {
      done(error, user);
   });
});

// Register user

passport.use('local.signup',
   new LocalStrategy({
      usernameField : 'email',
      userpasswordField : 'password',
      passReqToCallback : true,
   }, function(req, email, password, done) {
      let messages = [];
      Object.entries(validationResult(req).errors).forEach(([key, param]) => {
         messages.push(param.msg);
      });
      if (messages.length) {
         return done(null, false, req.flash('error', messages));
      }
      User.findOne({'email' : email}, function(err, user) {
         if(err) {
            return done(err);
         }
         if(user)
         {
            return done(null, false, {message : 'Email Already is in Use.'});
         }
         let newUser = createUser(email, password);
         newUser.save(function(error, result) {
            return (error) ? done(error) : done(null, newUser);
         })
      })
   })
);

passport.use('user.signin', new LocalStrategy({
   usernameField : 'email',
   userpasswordField : 'password',
   passReqToCallback : true,
}, (req, email, password, done) => {
      let messages = [];
      Object.entries(validationResult(req).errors).forEach(([key, param]) => {
         messages.push(param.msg);
      });
      if (messages.length) {
         return done(null, false, req.flash('error', messages));
      }
      User.findOne({email : email}, (err, user) => {
         if(err) {
            return done(err);
         }
         if(!user)
         {
            return done(null, false, {message : 'User name not found'});
         }
         if(!user.validPassword(password))
         {
            return done(null, false, {message : 'Password does not matches'});
         }
         return done(null, user);
      })
   }
));

function createUser(email, password)
{
   var newUser = new User();
   newUser.email = email;
   newUser.password = newUser.encryptPassword(password);
   return newUser;
}
