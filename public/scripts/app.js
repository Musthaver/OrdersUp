const url = '/restaurant';
const urlCart = '/restaurant/cart';
const urlOrder = '/restaurant/order';

const request = (options, cb) => {
  $.ajax(options)
    .done(response => {
      cb(response);
    })
    .fail(err => console.log('Error', err))
    .always(() => console.log('Request completed.'));
};

const fakeTable = {
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

const calculateTotal = (fakeTable) => {
  const cartArray = []
  for (const keyID in fakeTable){
    cartArray.push(fakeTable[keyID].price)
  }
  return cartArray.reduce((a,b) => a + b)
}

const displayCart = function(food) {
  const $article = $('<article>');
  const $foodName = $('<div>')
    .addClass('foodName')
    .text(food.name);
  const $price = $('<div>')
    .addClass('price')
    .text(food.price);
  const $delete = $('<i>').addClass('fas fa-times-circle')
  .on("click", function() { 
    alert('Deleted')})
  

  $article.append($foodName);
  $article.append($price);
  $article.append($delete);

  return $article;
};
// //"Refreshes" the page after adding a single tweet
// const loadOneFood = fakeTable2 => {
//   // const reqOptions = {
//   //   method: 'GET',
//   //   url: '/cart',
//   //   dataType: 'json'
//   // };
//   // // Trigger the Ajax request using reqOptions
//   // request(reqOptions, fakeTable2 => {
//   $('#cart').append(displayCart(fakeTable2));
//   // });
// };

$(function() {
  renderFoods(fakeTable);
  $('#cart').append($('<div>').addClass('total').text(calculateTotal(fakeTable)))
});

const renderFoods = fakeTable => {
  $.each(fakeTable, (index, keyID) => {
    $('#cart').append(displayCart(keyID));
  });
};

// const loadTweets = () => {
//   const reqOptions = {
//     method: 'GET',
//     url: '/tweets',
//     dataType: 'json'
//   };
//   // Trigger the Ajax request using reqOptions
//   request(reqOptions, tweet => {
//     renderTweets(tweet);
//   });
// };

// //"Refreshes" the page after adding a single tweet
// const loadSingleTweet = () => {
//   const reqOptions = {
//     method: 'GET',
//     url: '/tweets',
//     dataType: 'json'
//   };
//   // Trigger the Ajax request using reqOptions
//   request(reqOptions, tweet => {
//     $('.tweet-container').prepend(createTweetElement(tweet.pop()));
//   });
// };

// $(function() {
//   const $inputError = $('.error');
//   //Hide the error and the compose box then the page loads initially
//   $inputError.hide();
//   $('.new-tweet').hide();

//   //Toggles the compose button on click
//   $('.compose').click(function() {
//     $('.new-tweet').slideToggle('fast');
//     $('.text-area').focus();
//   });

//   //When the user clicks on submit, this function happens
//   const $form = $('form');
//   $form.on('submit', function(event) {
//     event.preventDefault();
//     const userInput = $(this).serialize();
//     const count = $('.text-area').val().length;
//     //Prevents the user to write a tweet longer than 140 characters and toggles an error message
//     if (count > 140) {
//       $inputError.slideUp('fast');
//       $inputError
//         .html('Please type less than 140 characters')
//         .slideDown('fast');
//       return;
//     }
//     //Prevents the user to post an empty tweet and toggles an error message
//     if (count === 0) {
//       $inputError.slideUp('fast');
//       $inputError.html('Please type in a tweet').slideDown('fast');
//       return;
//     } else {
//       $inputError.slideUp('fast');
//       //If the conditions are met, make an AJAX post
//       $.ajax({
//         data: userInput,
//         method: 'POST',
//         url: '/tweets'
//       })
//         .done(function(reponse) {
//           console.log('Success: ', reponse);
//           //Resets the counter to 140
//           $('#counter').html(140);
//           //Empties the text box
//           $('form')[0].reset();
//           //Adds the tweet to the page
//           loadSingleTweet();
//         })
//         .fail(error => {
//           console.log(`Error: ${error}`);
//         })
//         .always(() => {
//           console.log('Request completed');
//         });
//     }
//   });
//   //Adds the initial tweets to the page
//   loadTweets();
// });


// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });