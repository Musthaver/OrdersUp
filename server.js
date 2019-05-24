'use strict';

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const app = express();
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require('./routes/users');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  '/styles',
  sass({
    src: __dirname + '/styles',
    dest: __dirname + '/public/styles',
    debug: true,
    outputStyle: 'expanded'
  })
);
app.use(express.static('public'));
// app.use("/public", express.static(__dirname + '/public'));
// app.use('/img',express.static(path.join(__dirname, 'public/img')));


// Mount all resource routes
app.use('/api/users', usersRoutes(knex));
// app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Home page
app.get('/', (req, res) => {
  knex
    .select(
      'categories.name as category',
      'foods.id',
      'foods.name as name',
      'foods.price',
      'foods.description',
      'foods.image')
    .from('categories')
    .leftOuterJoin('foods','foods.category_id','categories.id')
    .orderBy('categories.id')
    .then(results => {
      const arrayOfCategories = [];
      for (const obj of results) {
        if (arrayOfCategories.includes(obj.category) === false) {
          arrayOfCategories.push(obj.category);
        }
      }
      res.render('index', {results, categories: arrayOfCategories})
    })
    .catch(function (err) {
      console.log(err)
    })
    .finally(()=> knex.destroy());
});

app.post('/cart', (req, res) => {
  // let foodID = req.body.id; //.data?
  // knex
  // .select()
  // .from('foods')
  // .where('foods.id', foodID)
  // .orderBy('categories.id')
  // .then(results => {
  //   res.send(results)
  // })
  // .catch(function (err) {
  //   console.log(err)
  // })
  // .finally(()=> knex.destroy());
  res.end();
});

app.delete('/cart', (req, res) => {
  res.end()
});

app.post('/order', (req, res) => {
  res.end()
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});
