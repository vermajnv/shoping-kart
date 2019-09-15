var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log(req.session.cart.items);
    Product.find((error, data) => {
        let productChunk = [];
        for (i = 0; i < data.length; i += 3) {
            productChunk.push(data.slice(i, i + 3));
        }
        res.render('shop/index', {
            title: 'Shopping Kart',
            productChunks: productChunk
        });
    })
});

router.get('/add-to-cart/:id', (req, res, next) => {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, (err, product) => {
        if (err) {
            res.redirect('/');
        } else {
            cart.add(product, product.id);
            req.session.cart = cart;
            res.redirect('/');
        }
    });
});

router.get('/shopping-cart', (req, res, next) => {
    res.render('shop/shopping-kart');
});

router.get('/checkout', (req, res, next) => {
    if (!req.session.cart) {
        res.render('shop/shopping-kart');
    }
    res.render('shop/checkout', {'publisableKey' : process.env.STRIPE_PULISHABLE_KEY});
});
module.exports = router;
