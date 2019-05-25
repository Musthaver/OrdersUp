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
const client = require('twilio')(process.env.TWILIOACCOUNT, process.env.TWILIOTOKEN);

// Seperated Routes for each Resource
const usersRoutes = require('./routes/users');


//TWilio
const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
        // The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
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
      'foods.image'
    )
    .from('categories')
    .leftOuterJoin('foods', 'foods.category_id', 'categories.id')
    .orderBy('categories.id')
    .then(results => {
      const arrayOfCategories = [];
      for (const obj of results) {
        if (arrayOfCategories.includes(obj.category) === false) {
          arrayOfCategories.push(obj.category);
        }
      }
      res.render('index', { results, categories: arrayOfCategories });
    })
    .catch(function(err) {
      console.log(err);
    })
});

app.post('/cart', (req, res) => {
  const foodID = Object.keys(req.body)[0];
  knex
    .select()
    .from('foods')
    .where('foods.id', foodID)
    .then(results => {
      //result is an array with one object
      res.send(results);
    })
    .catch(function(err) {
      console.log(err);
    })
});


app.post('/cart/quantity', (req, res) => {
  res.end();
});  

app.delete('/cart', (req, res) => {
  res.end();
});

app.post('/order', (req, res) => {
  client.messages
  // .create({
  //    body: 'Hello ' + req.body.name + ', we have advised the restaurant of your order and we will advise you of the estimated pick-up time.',
  //    from: '+14387963966',
  //    to: '+' + req.body.phone
  //  })
  // .then(message => console.log(message.sid));
  res.end()
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});
