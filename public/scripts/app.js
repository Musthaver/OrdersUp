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

const calculateTotal = cartArray => {
  const priceArray = [];
  for (const keyID of cartArray) {
    priceArray.push(Number(keyID.price));
  }
  if (priceArray.length === 0) {
    return 0;
  } else {
    return priceArray.reduce((a, b) => a + b);
  }
};

const calculateTaxes = subtotal => {
  return subtotal*0.15
}
const round = number => {
  return Math.round(number * 100) / 100
}

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
        const clear = { ...localStorage };
        const clearReal = JSON.parse(clear.cart);
        let cleared = clearReal.filter(obj => obj.name !== foodObj.name);
        localStorage.setItem('cart', JSON.stringify(cleared));
        foodArray = [clearReal];
        $('#cartitems').empty();
        let subtotal = round(calculateTotal(JSON.parse({ ...localStorage }.cart)));
        $('.subtotal').text('Subtotal: $' + subtotal);
        let taxes = round(calculateTaxes(calculateTotal(JSON.parse({ ...localStorage }.cart))));
        $('.taxes').text('Taxes: $' + taxes);
        $('.total').text('Total: $' + round((subtotal+taxes)) )
        renderFoods(cleared);
      });
    });

  $article.append($foodName);
  $article.append($price);
  $article.append($delete);
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
    const cart2 = JSON.parse(({...localStorage}.cart));  
    console.log(cart2);
      for (var i = 0; i < cart2.length; i++) {
        console.log(cart2[i].name, foodObj.name);
        if (cart2[i].name === foodObj.name) {
          cart2[i].quantity = (cart2[i].quantity + 1);
          console.log(cart2);
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

$(function() {
  $(this).scrollTop(0);

  // $('.subtotal').text('Subtotal: $' + calculateTotal(JSON.parse({...localStorage}.cart)));

  $('main article').on('click', function(event) {
    event.preventDefault();
    const foodID = $(this).attr('class');
    $.ajax({
      method: 'POST',
      url: '/cart',
      data: foodID
    })
      .done(response => {
        addItemToStorage(response[0]);
        let subtotal = round(calculateTotal(JSON.parse({...localStorage}.cart)));
        $('.subtotal').text('Subtotal: $' + subtotal);
        let taxes = round(calculateTaxes(calculateTotal(JSON.parse({ ...localStorage }.cart))));
        $('.taxes').text('Taxes: $' + taxes);
        $('.total').text('Total: $' + round((subtotal+taxes)) )
        let items = { ...localStorage };
        $('#cartitems').empty();
        items = JSON.parse(items.cart);
        renderFoods(items);
      })
      .fail(error => {
        console.log(`Error: ${error}`);
      })
      .always(() => {
        console.log('Request completed');
      });
  });

     

  $('.placeOrder').on('submit', function(event) {
    event.preventDefault();
    const $name = $(this)
      .find("input[name='name']")
      .val();
    const $phone = $(this)
      .find("input[name='phone']")
      .val();
    const $cartItems = JSON.parse(localStorage.cart);

    $.ajax({
      method: 'POST',
      url: '/order',
      data: {
        name: $name,
        phone: $phone,
        cartItems: $cartItems
      }
    })
      .done(response => {
        $('#cartitems').empty();
        $('#cart').text('Thank you for your order');
        localStorage.clear();
      })
      .fail(error => {
        console.log(`Order Post Error: ${error}`);
      })
      .always(() => {
        console.log('Order Post completed.');
      });
  });
});
