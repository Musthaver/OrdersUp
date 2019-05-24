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

const displayCart = function(foodObj, items) {
  const $article = $('<article>');
  const $foodName = $('<div>')
    .addClass('foodName')
    .text(foodObj.name);
  const $price = $('<div>')
    .addClass('price')
    .text(foodObj.price);
  const $delete = $('<i>')
    .addClass('fas fa-times-circle')
    .on('click', function(event) {
      event.preventDefault();
      $.ajax({
        url: '/cart',
        method: 'DELETE'
      }).done(function() {
        const clear = {...localStorage}
        const clearReal = JSON.parse(clear.cart)
        localStorage.removeItem(clearReal[foodObj]);
        foodArray = []
        $('#cartitems').empty();
        
        renderFoods();
      });
    });

  $article.append($foodName);
  $article.append($price);
  $article.append($delete);
  $('#cartitems').append($article);
  return $('#cartitems');
};

let foodArray = []
const addItemToStorage = foodID => {
  if(!localStorage.cart){
    localStorage.setItem('cart', '')
  }
  console.log(localStorage.cart)
  let foodObj = {
    name: foodID,
    price: foodID + 1
  }
  foodArray.push(foodObj)
  localStorage.setItem('cart', JSON.stringify(foodArray))
};

const renderFoods = itemsArray => {
  for (const foodObj of itemsArray) {
    $('#cartitems').append(displayCart(foodObj, itemsArray));
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
        let items = {...localStorage};
        $('#cartitems').empty();
        items = JSON.parse(items.cart)
        renderFoods(items);
      })
      .fail(error => {
        console.log(`Error: ${error}`);
      })
      .always(() => {
        console.log('Request completed');
      });
  });

  // renderFoods(fakeTable);
});
