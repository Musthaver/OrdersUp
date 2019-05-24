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
    img: 'https://www.placecage.com/200/300',
    name: 'Nicolas Cage?',
    description: 'best actor in the goddamn world',
    price: 999999
  },
  2: {
    img: 'https://www.placecage.com/g/200/300',
    name: 'Nicolas Cage!',
    description: 'best actor on the goddamn planet',
    price: 3
  },
  3: {
    img: 'https://www.placecage.com/c/200/300',
    name: 'Nicolas Cage!!!!!',
    description: 'best actor in the goddamn UNIVERSE',
    price: 1000
  }
};

let storeTest = {
  key1: {
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

const displayCart = function(food) {
  const $article = $('<article>');
  const $foodName = $('<div>')
    .addClass('foodName')
    .text(food.name);
  const $price = $('<div>')
    .addClass('price')
    .text(food.price);
  const $delete = $('<i>')
    .addClass('fas fa-times-circle')
    .on('click', function() {
      alert('Deleted');
    });

  $article.append($foodName);
  $article.append($price);
  $article.append($delete);
  $('#cart').append($article);
  return $('#cart');
};

const addItemToStorage = foodID => {
  storeTest[foodID] = {
    name: foodID,
    price: foodID + 1
  };
};

const renderFoods = fakeTable => {
  $.each(fakeTable, (index, keyID) => {
    $('#cart').append(displayCart(keyID));
  });
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
        localStorage.setItem('storeTest', storeTest[foodID].name);
        const retrievedObject = localStorage.getItem('storeTest');
        console.log(retrievedObject);
        displayCart(storeTest[foodID]);
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
