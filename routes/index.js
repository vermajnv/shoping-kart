var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session.cart);
   Product.find((error, data) => {
      let productChunk = [];
      for(i = 0; i < data.length; i += 3)
      {
         productChunk.push(data.slice(i, i + 3));
      }
      res.render('shop/index', { title: 'Shopping Kart', productChunks : productChunk});
   })
});

router.get('/add-to-cart/:id', (req, res, next) => {
   let productId = req.params.id;
   let cart = new Cart(req.session.cart ? req.session.cart : {});
   Product.findById(productId, (err, product) => {
      if(err)
      {
          res.redirect('/');
      }
      else {
          cart.add(product, product.id);
          req.session.cart = cart;
          res.redirect('/');
      }
   });
   console.log(cart);
});
module.exports = router;
