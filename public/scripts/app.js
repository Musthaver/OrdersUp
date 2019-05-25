const url = '/';
const urlCart = '/cart';
const urlQuantity = '/cart/quantity'
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

//create a date in form dd/mm/yyy
const getCreateDate = () => {
  const today = new Date()
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  return `${dd}/${mm}/${yyyy}`
}

//display the time in hours, minutes and seconds
const getCreateTime = () => {
  const today = new Date()
  const hours = today.getHours();
  const min = today.getMinutes();

  return `${hours}:${min}`
}

const generateRandomString = () => Math.random().toString(36).substring(7);

const calculateTaxes = subtotal => {
  return round(subtotal*0.15)
}
const round = number => {
  return Math.round(number * 100) / 100
}

const deleteItem = (event, foodObj) => {
  event.preventDefault();
      $.ajax({
        url: urlCart,
        method: 'DELETE'
      }).done(function() {
        const clear = { ...localStorage };
        const clearReal = JSON.parse(clear.cart);
        let cleared = clearReal.filter(obj => obj.name !== foodObj.name);
        localStorage.setItem('cart', JSON.stringify(cleared));
        $('#cartitems').empty();
        let subtotal = round(calculateTotal(JSON.parse({ ...localStorage }.cart)));
        $('.subtotal').text('Subtotal: $' + subtotal);
        let taxes = round(calculateTaxes(calculateTotal(JSON.parse({ ...localStorage }.cart))));
        $('.taxes').text('Taxes: $' + taxes);
        $('.total').text('Total: $' + round((subtotal+taxes)) )
        renderFoods(cleared);
      });
      return;
}

const doTheMath = function(cart) {
  let subtotal = round(calculateTotal(cart));
  let taxes = round(calculateTaxes(calculateTotal(cart)));
  $('.subtotal').text('Subtotal: $' + subtotal);
  $('.taxes').text('Taxes: $' + taxes);
  $('.total').text('Total: $' + round((subtotal+taxes)))
}

const removeToQuantity = (event, foodObj) => {
  event.preventDefault();
  $.ajax({
    url: urlQuantity,
    method: 'POST'
  }).done(function() {
    const cart = JSON.parse(({ ...localStorage }.cart)); 
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === foodObj.id) {
        cart[i].quantity = (cart[i].quantity - 1);
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    } 
    doTheMath(cart);
    $('#cartitems').empty();
    renderFoods(cart);
  });
}



const addToQuantity = (event, foodObj) => {
  event.preventDefault();
  $.ajax({
    url: urlQuantity,
    method: 'POST'
  }).done(function() {
    const cart = JSON.parse(({ ...localStorage }.cart)); 
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === foodObj.id) {
        cart[i].quantity = (cart[i].quantity + 1);
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    } 
    let subtotal = round(calculateTotal(JSON.parse({ ...localStorage }.cart)));
    $('.subtotal').text('Subtotal: $' + subtotal);
    let taxes = (calculateTaxes(calculateTotal(JSON.parse({ ...localStorage }.cart))));
    $('.taxes').text('Taxes: $' + taxes);
    $('.total').text('Total: $' + round((subtotal+taxes)))
    let items = { ...localStorage };
    $('#cartitems').empty();
    items = JSON.parse(items.cart);
    renderFoods(items);
  });

}

const displayCart = function(foodObj, items) {
  const $article = $('<article>')
    .attr('id', foodObj.id);
  const $amount = $('<div>')
    .addClass('amount');
  const $add = $('<i>')
    .addClass('fas fa-plus-circle')
    .on('click', function(event) {
      addToQuantity(event, foodObj)
    });
  const $quantity = $('<span>')
    .addClass('quantity')
    .text(foodObj.quantity);
  const $remove = $('<i>')
    .addClass('fas fa-minus-circle') 
    .on('click', function(event) {
       removeToQuantity(event, foodObj)
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
      deleteItem(event, foodObj)
    });
  $price.append($delete);
  $amount.append($add);
  $amount.append($quantity);
  $amount.append($remove);
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
    const cart2 = JSON.parse(({...localStorage}.cart));  
      for (var i = 0; i < cart2.length; i++) {
        if (cart2[i].name === foodObj.name) {
          cart2[i].quantity = (cart2[i].quantity + 1);
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
    const $date = getCreateDate()
    const $time = getCreateTime()
    const $id = generateRandomString()

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
        $('#cart').text(`Thank you for your order! Ordered at ${$time} on ${$date}`);
        localStorage.clear();
      //   setTimeout(()=>{
      //     ajax('/order/' + response.order_id+'/message').then((message)=> if() : 
      //   }, 5000)
      })
      .fail(error => {
        console.log(`Order Post Error: ${error}`);
      })
      .always(() => {
        console.log('Order Post completed.');
      });
  });

});
