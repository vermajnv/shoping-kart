const Product = require('../models/product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/kart', {useNewUrlParser : true});

var product = [
   new Product({
      imagePath : 'https://via.placeholder.com/100',
      title : 'Philips CFL',
      description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      price : 135,
   }),
   new Product({
      imagePath : 'https://via.placeholder.com/100',
      title : 'Philips LED',
      description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt et dolore magna aliqua.',
      price : 315,
   }),
   new Product({
      imagePath : 'https://via.placeholder.com/100',
      title : 'Alen Solly',
      description : 'Lorem ipsum amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      price : 305,
   }),
   new Product({
      imagePath : 'https://via.placeholder.com/100',
      title : 'Peter Parker',
      description : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut  aliqua.',
      price : 350,
   }),
   new Product({
      imagePath : 'https://via.placeholder.com/100',
      title : 'Nebula',
      description : 'amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit',
      price : 235,
   }),
];

let done = 0;
product.forEach((prod) => {
   prod.save((error, result) => {
      done++;
      if(done === product.length)
      {
         mongoose.disconnect();
      }

   })
})
