// Dependencies =========================
var twit      = require('twit'),
    fs        = require('fs'),
    artists   = require('./Artists.js'),
    utils     = require('./Utils.js');


// Local Variables ======================
var T           = null,
    username    = "",
    image_reply = true;

// Local Functions ======================
// Takes an object from Artist.js and uses the data to form a response.
// Responds with generic reply if undefined.
function makeResponseFromArtist(artist) {
  if (artist === undefined) {
    return 'Oops, I didn\'t quite catch you there! Try again or read about our artists here: http://overlap.show/';
  }
  return artist.snippet+' More info: http://overlap.show/artist/'+artist.slug;
}

// Takes an object from Artist.js and returns the file path of an artist's headshot.
function getMediaURLFromArtist(artist) {
  if (artist === undefined) {
    return null;
  }
  return artist.photo;
}

// Posts a tweet reply with an attatched image.
function postMediaTweet (twitter, message, ID, file_path, artist_name) {
  console.log("Encoding " + file_path + " to base64...");
  // Encode image as base64 before uploading to Twitter.
  var base64img = fs.readFileSync(file_path, {encoding: 'base64'}),
      media_id_str,
      alt_text  = "A photo of " + artist_name;
  
  console.log("Uploading media to Twitter...");
  twitter.post('media/upload', {
    media_data: base64img
  }, function (error, data, response) {
    if (error) {
      console.log("Error uploading media:");
      console.log(error);
    } else {
      media_id_str = data.media_id_string;
   
      // Generate metadata with alt_text for accessability.
      var meta_data = {
        media_id: media_id_str,
        alt_text: {
          text: alt_text
        }
      };
      
      console.log("Creating image metadata...");
      T.post('media/metadata/create', meta_data, function (error, data, response) {
        if (error) {
          console.log("Error creating media metadata:");
          console.log(error);
        } else {
          var params = {
            status                : message,
            in_reply_to_status_id : ID,
            media_ids             : [media_id_str]
          };
          console.log("Posting Tweet...");
          twitter.post('statuses/update', params, function (error, data, response) {
            if (error) {
              console.log("Error posting tweet:");
              console.log(error);
            } else {
              console.log("Reply posted! {");
              console.log("  status: " + message);
              console.log("  in_reply_to_status_id: " + ID);
              console.log("  media_id: " + media_id_str);
              console.log("}");
              console.log("");
            }
          });
        }
      });
    }
  })
}

function postTextTweet(twitter, message, ID) {
  console.log("Posting tweet...");
  twitter.post('statuses/update', {
    status                : message,
    in_reply_to_status_id : ID
  }, function (err, data, response) {
    if(err) {
      console.log("Error posting tweet:");
      console.log(err);
    } else {
      console.log("Reply posted! {");
      console.log("  status: " + message);
      console.log("  in_reply_to_status_id: " + ID);
      console.log("}");
      console.log("");
    }
  });
}

function postTweet(twitter, ID, username, artist) {
  var message = '@' + username + ' ' + makeResponseFromArtist(artist);
  if (artist !== undefined && image_reply) {
    postMediaTweet(
      twitter, 
      message, 
      ID,
      // Absolute path to image file.
      __dirname + artist.photo, 
      // Artists full name used for image alt-text.
      artist.keywords[1]
    );
  } else {
    postTextTweet(
      twitter, 
      message, 
      ID
    );
  }
}

module.exports = {
  init: function() {
    console.log("Creating twit object with the following credentials {");
    console.log("  Twitter handle: @" + process.env.TWITTER_USERNAME);
    console.log("  Consumer Key: " + process.env.CONSUMER_KEY);
    console.log("  Consumer Secret: " + process.env.CONSUMER_SECRET);
    console.log("  Access Token: " + process.env.ACCESS_TOKEN_KEY);
    console.log("  Access Secret: " + process.env.ACCESS_TOKEN_SECRET);
    console.log("}");
    console.log("");
    
    T = new twit({
      consumer_key:         process.env.CONSUMER_KEY,
      consumer_secret:      process.env.CONSUMER_SECRET,
      access_token:         process.env.ACCESS_TOKEN_KEY,
      access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
      // 5 minute timeout.
      timeout_ms:           60*5000,
    });
    
    username = process.env.TWITTER_USERNAME;
  },
  
  setupStream: function () {
    console.log("Setting up Twitter stream with the following parameters {");
    console.log("  track: @" + username);
    console.log("}");
    console.log("");
    
    T.stream('statuses/filter', {track: '@'+username})
      .on('tweet', function (tweet) {
        console.log("Tweet recieved {");
        console.log("  username: "  + tweet.user.screen_name);
        console.log("  tweet: "     + tweet.text);
        console.log("  status_ID: " + tweet.id_str)
        console.log("}");
        console.log("");

        message = utils.sanitze(tweet.text);

        if (message.indexOf("tell me about ") !== -1) {
              statusID       = tweet.id_str,
              user           = tweet.user.screen_name,
              selectedArtist = [];

          // Cycle through every artist and check if any of their keywords are included.
          for (var i = 0; i < artists.length; i++) {
            for (var j = 0; j < artists[i].keywords.length; j++) {
              if (message.indexOf(artists[i].keywords[j]) > -1) {
                selectedArtist.push(artists[i]);
              }
            };
          };

          // If we recognised the keywords tweet some info!
          // If not, reply with generic response.
          if (selectedArtist.length > 0) {
            for (var i = 0; i < selectedArtist.length; i++) {
              postTweet(T, statusID, user, selectedArtist[i]);
            } 
          } else {
            postTweet(T, statusID, user, undefined);
          }
        }
      });
    },
  
  // Close Twitter stream on exit.
  exit: function () {
    T.stream.stop();
  }
}