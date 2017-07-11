// Dependencies =========================
var twit      = require('twit'),
    artists   = require('./Artists.js'),
    utils     = require('./Utils.js'),
    base64Img = require('base64-img');


// Local Variables ======================
var T         = null,
    username  = "";

function makeResponseFromArtist(artist) {
  if (artist === undefined) {
    return 'Oops, I didn\'t quite catch you there! Try again or read about our artists here: http://overlap.show/';
  }
  return artist.snippet+' More info: http://overlap.show/artist/'+artist.slug;
}

function getMediaURLFromArtist(artist) {
  if (artist === undefined) {
    return null;
  }
  return artist.photo;
}

function uploadMedia(twitter, mediaURL) {
  var imageStr;
  
  console.log("Encoding media to base64...");
  base64Img.requestBase64(mediaURL, function(err, res, body) {
    if (!err) {
      var imageData = body;
      
      console.log("Uploading base64 media to twitter...");
      twitter.post('media/upload', {
        media_data: imageData
      }, function(err, data, response) {
        if (!err) {
          console.log("Media ID string {");
          console.log("  "+data.media_id_str);
          console.log("}");

          imageStr = data.media_id_str;
        } else {
          console.log("Error uploading media to twitter:");
          console.log(err);
          imageStr = null;
        }
      });
    } else {
      console.log("Error convtering media URL to base64:");
      console.log(err);
    }
  });
  
  return imageStr;
}

function postTweet(twitter, ID, username, artist) {
  var response    = '@'+username+' '+makeResponseFromArtist(artist),
      mediaURL    = getMediaURLFromArtist(artist),
      mediaID     = uploadMedia(twitter, mediaURL);

  twitter.post('statuses/update', {
    status                : response,
    in_reply_to_status_id : ID,
    media_ids             : mediaID
  }, function(err, data, response) {
    if(err) {
      console.log("Error posting tweet:");
      console.log(err);
    } else {
      console.log("Reply posted! {");
      console.log("  status: " + response);
      console.log("  in_reply_to_status_id: " + ID);
      console.log("}");
    }
  });
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
    
    T = new twit({
      consumer_key:         process.env.CONSUMER_KEY,
      consumer_secret:      process.env.CONSUMER_SECRET,
      access_token:         process.env.ACCESS_TOKEN_KEY,
      access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
      timeout_ms:           60*1000,
    });
    username = process.env.TWITTER_USERNAME;
  },
  
  setupStream: function () {
    console.log("Setting up Twitter stream with the following parameters {");
    console.log("  track: @" + username);
    console.log("}");
    
    var stream = T.stream('statuses/filter', {track: '@'+username});
    
    stream.on('tweet', function (tweet) {
      console.log("Tweet recieved {");
      console.log("  username: "+tweet.user.screen_name);
      console.log("  tweet: "+tweet.text);
      console.log("}");
      
      message = utils.sanitze(tweet.text);
      
      if (message.substring(0, 27) === "@overlapshow tell me about ") {
        var tweetText      = message.slice(27),
            statusID       = tweet.id_str,
            user           = tweet.user.screen_name,
            selectedArtist = [];

        for (var i = 0; i < artists.length; i++) {
          for (var j = 0; j < artists[i].keywords.length; j++) {
            // if the keyword is part of the tweet then set the artist
            if (tweetText.indexOf(artists[i].keywords[j]) > -1) {
              selectedArtist.push(artists[i]);
            }
          };
        };

        if (selectedArtist.length > 0) {
          for (var i = 0; i < selectedArtist.length; i++) {
            postTweet(T, statusID, user, selectedArtist[i]);
          }
        }
      }
    });
  },
  
  exit: function () {
    T.stream.stop();
  }
}