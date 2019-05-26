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
const client = require('twilio')(
  process.env.TWILIOACCOUNT,
  process.env.TWILIOTOKEN
);

// Seperated Routes for each Resource
const usersRoutes = require('./routes/users');

//TWilio
const http = require('http');
http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});

app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
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

// Mount all resource routes
app.use('/api/users', usersRoutes(knex));

//format the order format send it to the restaurant via SMS
const makeTheOrder = cartItems => {
  let order = '';
  for (let [i, orderObj] of cartItems.entries()) {
    if (i === cartItems.length - 1) {
      order += `${orderObj.name} x${orderObj.quantity}`;
    } else {
      order += `${orderObj.name} x${orderObj.quantity},  `;
    }
  }
  return order;
};

//Add the order to the oder DB
const insertIntoDB = (id, name, phone, order, time, date) => {
  knex('orders')
    .insert({
      id: id,
      name: name,
      phone: phone,
      order: order,
      time: time,
      date: date,
      SMSsent: false
    })
    .then(results => {})
    .catch(function(err) {
      console.log(err);
    });
};

//Send initial SMS to the client upon placed order
const sendSMSToClient = name => {
  client.messages
    .create({
      body: `Hello ${name}, we have advised the restaurant of your order and we will advise you of the estimated pick-up time.`,
      from: '+14387963088',
      to: `+${phoneNumber}`
    })
    .then(message => console.log(message.sid));
};

//Send initial SMS to the Restaurant upon placed order
const sendSMSToRestaurant = (name, order, time) => {
  client.messages
    .create({
      body: `Hello, ${name} sent a new order of ${order} at ${time}. Please respond with an ETA for the order to be ready`,
      from: '+14387963088',
      to: '+15148059285'
    })
    .then(message => console.log(message.sid));
};

//knex request to pull a food from the database to be added to the cart
const selectASingleFood = (foodID, res) => {
  knex
    .select()
    .from('foods')
    .where('foods.id', foodID)
    .then(results => {
      //results is an array with one object
      res.send(results);
    })
    .catch(function(err) {
      console.log(err);
    });
};

//knex request to pull the restaurant's orders for their orders page
const displayOrderPage = res => {
  knex
    .select()
    .from('orders')
    .orderBy('time')
    .then(results => {
      res.render('orders', {
        orders: results
      });
    })
    .catch(function(err) {
      console.log(err);
    });
}

//knex request to pull all the foods by category from DB (ordered by category)
const displayHomePage = res => {
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
      let arrayOfCategories = matchCategories(results);
      res.render('index', {
        results,
        categories: arrayOfCategories
      });
    })
    .catch(function(err) {
      console.log(err);
    });
};

//creating an array of categories to help display them on index.ejs
const matchCategories = results => {
  const arrayOfCategories = [];
  for (const obj of results) {
    if (arrayOfCategories.includes(obj.category) === false) {
      arrayOfCategories.push(obj.category);
    }
  }
  return arrayOfCategories;
};

app.get('/', (req, res) => {
  displayHomePage(res);
});

app.get('/past_orders', (req, res) => {
  displayOrderPage(res)
});

app.post('/cart', (req, res) => {
  const foodID = Object.keys(req.body)[0];
  selectASingleFood(foodID, res);
});

app.post('/cart/quantity', (req, res) => {
  res.end();
});

app.delete('/cart', (req, res) => {
  res.end();
});

let phoneNumber;
let clientName;

//add order to the DB, call send initial SMS functions
app.post('/order', (req, res) => {
  const {
    name,
    phone,
    cartItems,
    date,
    time,
    id
  } = req.body;
  phoneNumber = phone;
  clientName = name;
  let order = makeTheOrder(cartItems);
  insertIntoDB(id, name, phone, order, time, date);
  // sendSMSToClient(name);
  // sendSMSToRestaurant(name, order, time);
  res.end();
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});

//forwarding time estimate from the restaurant to the client
app.post('/sms', (req, res) => {
  let response = req.body.Body;
  client.messages
    .create({
      body: `Hello ${clientName}, your order will be ready in ${response}`,
      from: '+14387963088',
      to: `+${phoneNumber}`
    })
    .then(message => console.log(message.sid));
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());
});

//sending text to client when restaurant clicks on Send SMS button on orders page
app.post('/past_orders/sms', (req, res) => {
  const {
    phoneNumber
  } = req.body;
  knex('orders').where({
      phone: phoneNumber
    }).update('SMSsent', true)
    .then(results => {
    })
    .catch(function(err) {
      console.log(err);
    });

  client.messages
    .create({
      body: `Hello, your order is ready for pickup.`,
      from: '+14387963088',
      to: `+${phoneNumber}`
    })
    .then(message => console.log(message.sid));
  res.end();
});
