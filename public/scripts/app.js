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

const calculateTotal = fakeTable => {
  const cartArray = [];
  for (const keyID in fakeTable) {
    cartArray.push(fakeTable[keyID].price);
  }
  return cartArray.reduce((a, b) => a + b);
};

const displayCart = function(foodID) {
  const $article = $('<article>');
  const $foodName = $('<div>')
    .addClass('foodName')
    .text(fakeTable[foodID].name);
  const $price = $('<div>')
    .addClass('price')
    .text(fakeTable[foodID].price);
  const $delete = $('<i>')
    .addClass('fas fa-times-circle')
    .on('click', function(event) {
      event.preventDefault();
      $.ajax({
        url: '/cart',
        method: 'DELETE'
      }).done(function() {
        delete fakeTable[foodID];
        $('#cart').empty();
        renderFoods(fakeTable);
      });
    });

  $article.append($foodName);
  $article.append($price);
  $article.append($delete);
  $('#cart').append($article);
  return $('#cart');
};

const addItemToStorage = foodID => {
  fakeTable[foodID] = {
    name: foodID,
    price: foodID + 1
  };
};

const renderFoods = fakeTable => {
  for (const keyID in fakeTable) {
    $('#cart').append(displayCart(keyID));
  }
};

$(function() {
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
        localStorage.setItem('testObject', JSON.stringify(fakeTable))
        var retrievedObject = localStorage.getItem('fakeTable');
        console.log('retrievedObject: ', JSON.parse(retrievedObject));
        $('#cart').empty();
        renderFoods(fakeTable);
      })
      .fail(error => {
        console.log(`Error: ${error}`);
      })
      .always(() => {
        console.log('Request completed');
      });
  });

  renderFoods(fakeTable);
});
