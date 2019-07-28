var express = require('express');
var router = express.Router();

var Product = require('../models/product');

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

module.exports = router;
