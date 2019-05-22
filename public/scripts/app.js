const url = '/restaurant';
const urlCart = '/restaurant/cart'
const urlOrder = '/restaurant/order'

const request = (options, cb) => {
  $.ajax(options)
    .done(response => {
      cb(response);
    })
    .fail(err => console.log("Error", err))
    .always(() => console.log("Request completed."));
};


// Creates the DOM tree dynamically as the tweets are posted.
const displayCart = function(foods) {
  const $article = $("<article>");
  const $header = $("<header>");
  const $avatar = $("<img>")
    .addClass("avatar")
    .attr("src", tweetData.user.avatars.small);
  const $headerUserName = $("<div>")
    .addClass("username")
    .text(tweetData.user.name);
  const $headerEmail = $("<div>")
    .addClass("email")
    .text(tweetData.user.handle);
  const $divTextBox = $("<div>").addClass("box");
  const $divText = $("<div>")
    .addClass("tweetText")
    .text(tweetData.content.text);
  const $footer = $("<footer>");
  const $footerIcon1 = $("<i>")
    .addClass("far fa-thumbs-up")
  const $footerIcon2 = $("<i>").addClass("fas fa-flag-usa");
  const $footerIcon3 = $("<i>").addClass("fas fa-retweet");
  const $footerLike = $("<div>")
    .addClass("like")
    .text(tweetData.likes);
  const $footerTime = $("<text>")
    .addClass("time")
    .text(timeSince(new Date(tweetData.created_at)));

  $article.append($header);
  $article.append($divTextBox);
  $article.append($footer);
  $header.append($avatar);
  $header.append($headerUserName);
  $header.append($headerEmail);
  $divTextBox.append($divText);
  $footer.append($footerTime);
  $footer.append($footerIcon1);
  $footer.append($footerIcon2);
  $footer.append($footerIcon3);
  $footer.append($footerLike);

  return $article;
};

//Loops through the database in order to render tweets
const renderTweets = tweets => {
  $.each(tweets, (index, tweet) => {
    //display the tweets in inverse chronological order
    $(".tweet-container").prepend(createTweetElement(tweet));
  });
};

// Loads the page with the initial tweets in the database
const loadTweets = () => {
  const reqOptions = {
    method: "GET",
    url: "/tweets",
    dataType: "json"
  };
  // Trigger the Ajax request using reqOptions
  request(reqOptions, tweet => {
    renderTweets(tweet);
  });
};

//"Refreshes" the page after adding a single tweet
const loadSingleTweet = () => {
  const reqOptions = {
    method: "GET",
    url: "/tweets",
    dataType: "json"
  };
  // Trigger the Ajax request using reqOptions
  request(reqOptions, tweet => {
    $(".tweet-container").prepend(createTweetElement(tweet.pop()));
  });
};

$(function() {
  const $inputError = $(".error");
  //Hide the error and the compose box then the page loads initially
  $inputError.hide();
  $(".new-tweet").hide();

  //Toggles the compose button on click
  $(".compose").click(function() {
    $(".new-tweet").slideToggle("fast");
    $(".text-area").focus();
  });

  //When the user clicks on submit, this function happens
  const $form = $("form");
  $form.on("submit", function(event) {
    event.preventDefault();
    const userInput = $(this).serialize();
    const count = $(".text-area").val().length;
    //Prevents the user to write a tweet longer than 140 characters and toggles an error message
    if (count > 140) {
      $inputError.slideUp("fast");
      $inputError
        .html("Please type less than 140 characters")
        .slideDown("fast");
      return;
    }
    //Prevents the user to post an empty tweet and toggles an error message
    if (count === 0) {
      $inputError.slideUp("fast");
      $inputError.html("Please type in a tweet").slideDown("fast");
      return;
    } else {
      $inputError.slideUp("fast");
      //If the conditions are met, make an AJAX post
      $.ajax({
        data: userInput,
        method: "POST",
        url: "/tweets"
      })
        .done(function(reponse) {
          console.log("Success: ", reponse);
          //Resets the counter to 140
          $("#counter").html(140);
          //Empties the text box
          $("form")[0].reset();
          //Adds the tweet to the page
          loadSingleTweet();
        })
        .fail(error => {
          console.log(`Error: ${error}`);
        })
        .always(() => {
          console.log("Request completed");
        });
    }
  });
  //Adds the initial tweets to the page
  loadTweets();
});

