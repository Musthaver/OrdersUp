const url = '/';
const urlCart = '/cart';
const urlOrder = '/order';

const request = (options, cb) => {
  $.ajax(options)
    .done(response => {
      cb(response);
    })
    .fail(err => console.log('Error', err))
    .always(() => console.log('Request completed.'));
};




let fakeTable = {
  1: {
    name: 'Nicolas Cage?',
    price: 999999
  },
  2: {
    name: 'Nicolas Cage!',
    price: 3
  },
  3: {
    name: 'Nicolas Cage!!!!!',
    price: 1000
  },
  4: {
    name: 'food1',
    price: 'one milion $'
  }
};

const calculateTotal = items => {
  const cartArray = [];
  for (const keyID in items) {
    cartArray.push(items[keyID].price);
  }
  return cartArray.reduce((a, b) => a + b);
};

const displayCart = function(foodID, items) {
  const $article = $('<article>');
  const $foodName = $('<div>')
    .addClass('foodName')
    .text(items[foodID].name);
  const $price = $('<div>')
    .addClass('price')
    .text(items[foodID].price);
  const $delete = $('<i>')
    .addClass('fas fa-times-circle')
    .on('click', function(event) {
      event.preventDefault();
      $.ajax({
        url: '/cart',
        method: 'DELETE'
      }).done(function() {
        delete items[foodID];
        $('#cart').empty();
        renderFoods(items);
      });
    });

  $article.append($foodName);
  $article.append($price);
  $article.append($delete);
  $('#cart').append($article);
  return $('#cart');
};

const addItemToStorage = foodID => {
  if(!localStorage.cart){
    localStorage.setItem('cart', "")
  }
  let foodObj = JSON.stringify({
    name: foodID,
    price: foodID + 1
  })
  localStorage.setItem([foodID], foodObj)
};

const renderFoods = items => {
  for (const keyID in items) {
    $('#cart').append(displayCart(keyID, items));
  }
};

$(function() {
  $(this).scrollTop(0);
  $('#cart').append(
    $('<div>')
      .addClass('total')
      .text(calculateTotal(fakeTable))
  );

  $('main article').on('click', function(event) {
    event.preventDefault();
    const foodID = $(this).attr('class');
    $.ajax({
      method: 'POST',
      url: '/cart',
      data: foodID
    })
      .done(response => {
        addItemToStorage(foodID);
        const items = {...localStorage};
        console.log(items);
        $('#cart').empty();
        renderFoods(items);
      })
      .fail(error => {
        console.log(`Error: ${error}`);
      })
      .always(() => {
        console.log('Request completed');
      });
  });

  renderFoods(fakeTable);


$('.placeOrder').on('submit', function(event) {
  event.preventDefault();
  const $name = $(this).find("input[name='name']").val();
  const $phone = $(this).find("input[name='phone']").val();
  const $cartItems = JSON.parse(localStorage.cart);

  $.ajax({
    method: 'POST',
    url: '/order',
    data: {
      name: $name, 
      phone: $phone,
      cartItems: $cartItems,
    }
    })
    .done((response) => {
      $('#cartitems').empty();
      $('#cart').text("Thank you for your order");
    })      
    .fail(error => {
    console.log(`Order Post Error: ${error}`);
    })
    .always(() => {
    console.log('Order Post completed.');
    });
  });  
});
