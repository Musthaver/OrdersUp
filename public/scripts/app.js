const url = '/';
const urlCart = '/cart';
const urlQuantity = '/cart/quantity';
const urlOrder = '/order';

const request = (options, cb) => {
  $.ajax(options)
    .done(response => {
      cb(response);
    })
    .fail(err => console.log('Error', err))
    .always(() => console.log('Request completed.'));
};

const calculateTotal = cartArray => {
  const priceArray = [];
  for (const keyID of cartArray) {
    let quantity = keyID.quantity;
    let price = keyID.price;
    priceArray.push(Number(quantity) * Number(price));
  }
  if (priceArray.length === 0) {
    return 0;
  } else {
    return priceArray.reduce((a, b) => a + b);
  }
};

const getCreateDate = () => {
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

const getCreateTime = () => {
  const today = new Date();
  const hours = today.getHours();
  const min = today.getMinutes();

  return `${hours}:${min}`;
};

const addItemToCart = () => {
  $('main article').on('click', function(event) {
    event.preventDefault();
    const foodID = $(this).attr('class');
    $.ajax({
      method: 'POST',
      url: urlCart,
      data: foodID
    })
      .done(response => {
        addItemToStorage(response[0]);
        const cart = JSON.parse({ ...localStorage }.cart);
        doTheMath(cart);
        $('#cartitems').empty();
        renderFoods(cart);
      })
      .fail(error => {
        console.log(`Error: ${error}`);
      })
      .always(() => {
        console.log('Request completed');
      });
  });
};

const generateRandomString = () =>
  Math.random()
    .toString(36)
    .substring(7);

const calculateTaxes = subtotal => {
  return round(subtotal * 0.15);
};
const round = number => {
  return Math.round(number * 100) / 100;
};

const deleteItem = (event, foodObj) => {
  event.preventDefault();
  $.ajax({
    url: urlCart,
    method: 'DELETE'
  }).done(function() {
    const cart = JSON.parse({ ...localStorage }.cart);
    let cleared = cart.filter(obj => obj.name !== foodObj.name);
    localStorage.setItem('cart', JSON.stringify(cleared));
    doTheMath(cleared);
    $('#cartitems').empty();
    renderFoods(cleared);
  });
  return;
};

const doTheMath = function(cart) {
  let subtotal = round(calculateTotal(cart));
  let taxes = round(calculateTaxes(calculateTotal(cart)));
  $('.subtotal').text('Subtotal: $' + subtotal.toFixed(2));
  $('.taxes').text('Taxes: $' + taxes.toFixed(2));
  $('.total').text('Total: $' + round(subtotal + taxes).toFixed(2));
};

const removeToQuantity = (event, foodObj) => {
  event.preventDefault();
  $.ajax({
    url: urlQuantity,
    method: 'POST'
  }).done(function() {
    const cart = JSON.parse({ ...localStorage }.cart);
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === foodObj.id) {
        cart[i].quantity = cart[i].quantity - 1;
        localStorage.setItem('cart', JSON.stringify(cart));
      }
      doTheMath(cart);
      $('#cartitems').empty();
      renderFoods(cart);
    }
  });
};
const addToQuantity = (event, foodObj) => {
  event.preventDefault();
  $.ajax({
    url: urlQuantity,
    method: 'POST'
  }).done(function() {
    const cart = JSON.parse({ ...localStorage }.cart);
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === foodObj.id) {
        cart[i].quantity = cart[i].quantity + 1;
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }
    doTheMath(cart);
    $('#cartitems').empty();
    renderFoods(cart);
  });
};

const displayCart = function(foodObj, items) {
  const $article = $('<article>').attr('id', foodObj.id);
  const $amount = $('<div>').addClass('amount');
  const $add = $('<i>')
    .addClass('fa fa-arrow-right')
    .on('click', function(event) {
      addToQuantity(event, foodObj);
    });
  const $quantity = $('<span>')
    .addClass('quantity')
    .text(foodObj.quantity);
  const $remove = $('<i>')
    .addClass('fa fa-arrow-left')
    .on('click', function(event) {
      if (foodObj.quantity > 1) {
        removeToQuantity(event, foodObj);
      } else {
        deleteItem(event, foodObj);
      }
    });
  const $foodName = $('<div>')
    .addClass('foodName')
    .text(foodObj.name);
  const $price = $('<div>')
    .addClass('price')
    .text('$' + foodObj.price);
  const $delete = $('<i>')
    .addClass('fas fa-times-circle')
    .on('click', function(event) {
      deleteItem(event, foodObj);
    });
  $price.append($delete);
  $amount.append($remove);
  $amount.append($quantity);
  $amount.append($add);
  $article.append($amount);
  $article.append($foodName);
  $article.append($price);
  $('#cartitems').append($article);
  return $('#cartitems');
};

const addItemToStorage = foodObj => {
  if (!localStorage.cart) {
    let foodArray = [];
    foodObj.quantity = 1;
    foodArray.push(foodObj);
    localStorage.setItem('cart', JSON.stringify(foodArray));
  } else {
    const cart2 = JSON.parse({ ...localStorage }.cart);
    for (var i = 0; i < cart2.length; i++) {
      if (cart2[i].name === foodObj.name) {
        cart2[i].quantity = cart2[i].quantity + 1;
        return localStorage.setItem('cart', JSON.stringify(cart2));
      }
    }
    foodObj.quantity = 1;
    cart2.push(foodObj);
    localStorage.setItem('cart', JSON.stringify(cart2));
  }
};

const renderFoods = itemsArray => {
  for (const foodObj of itemsArray) {
    $('#cartitems').append(displayCart(foodObj, itemsArray));
  }
};

const placeOrder = () => {
  $('.placeOrder').on('submit', function(event) {
    event.preventDefault();
    const $name = $(this)
      .find("input[name='name']")
      .val();
    const $phone = $(this)
      .find("input[name='phone']")
      .val();
    const $cartItems = JSON.parse(localStorage.cart);
    const $date = getCreateDate();
    const $time = getCreateTime();
    const $id = generateRandomString();

    $.ajax({
      method: 'POST',
      url: urlOrder,
      data: {
        name: $name,
        phone: $phone,
        cartItems: $cartItems,
        date: $date,
        time: $time,
        id: $id
      }
    })
      .done(response => {
        $('#cartitems').empty();
        $('#cart').text(
          `Thank you for your order! Ordered at ${$time} on ${$date}`
        );
        localStorage.clear();
        // setTimeout(() => {
        //   $ajax({
        //     method: 'GET',
        //     url: ('/order/' + $id + '/message')
        //   })
        //   .done((message)=> if(message) {
        //     $('#cart').text('Your order will be ready in ' + message)
        //   })
        //   .fail(error => {
        //     console.log(`Order Post Error: ${error}`);
        //   })
        // }, 5000);
      })
      .fail(error => {
        console.log(`Order Post Error: ${error}`);
      })
      .always(() => {
        console.log('Order Post completed.');
      });
  });
};

$(function() {
  $(this).scrollTop(0);
  addItemToCart();
  placeOrder();
});
