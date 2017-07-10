// Dependencies =========================
var twit      = require('twit'),
    Artists   = require('./Artists.js'),
    Utils     = require('./Utils.js');

// Local Variables ======================
var T         = null,
    username  = "";

module.exports = {
  init        : function() {
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
  
  setupStream : function () {
    console.log("Setting up Twitter stream with the following parameters {");
    console.log("  track: @" + username);
    console.log("}");
    
    var stream = T.stream('statuses/filter', {track: '@'+username});
    
    stream.on('tweet', function (tweet) {
      console.log("Tweet recieved!");
      console.log(tweet);
      
      message = Utils.sanitze(tweet.text);
      
      if(message.substring(0, 27) === "@overlapshow tell me about ") {
        var artist      = message.slice(27),
            tweetID     = tweet.id_str,
            user        = tweet.user.screen_name,
            response    = "@" + user + " ";
        
        switch(artist) {
          case "thalia":
          case "thalia agroti":  
            response += Artists['AGROTI'];
            break;
          case "eleni":
          case "eleni alexandri":
            response += Artists['ALEXANDRI'];
            break;
          case "arturas":
          case "arturas bondarciukas":
            response += Artists['BONDARCIUKAS'];
            break;
          case "amy":
          case "amy cartwright":
            response += Artists['CARTWRIGHT'];
            break;
          case "charlotte":
          case "charlotte dann":
            response += Artists['DANN'];
            break;
          case "laura":
          case "laura dekker":
            response += Artists['DEKKER'];
            break;
          case "diane":
          case "diane edwards":
            response += Artists['EDWARDS'];
            break;
          case "saskia":
          case "saskia freeke":
            response += Artists['FREEKE'];
            break;
          case "miduo":
          case "miduo gao":
            response += Artists['GAO'];
            break;
          case "jakob":
          case "jakob glock":
            response += Artists['GLOCK'];
            break;
          case "georgios":
          case "georgios greekalogerakis":
            response += Artists['GREEKALOGERAKIS'];
            break;
          case "jayson":
          case "jayson haebich":
            response += Artists['HAEBICH'];
            break;
          case "jade":
          case "jade hall smith":
            response += Artists['HALL_SMITH'];
            break;
          case "freddie":
          case "freddie hong":
            response += Artists['HONG'];
            break;
          case "ewa":
          case "ewa justka":
            response += Artists['JUSTKA'];
            break;
          case "natthakit":
          case "natthakit kangsadansenanon":
            response += Artists['KANGSADANSENANON'];
            break;
          case "mehrbano":
          case "mehrbano khattak":
            response += Artists['KHATTAK'];
            break;
          case "philip":
          case "philip liu":
            response += Artists['LIU'];
            break;
          case "alix":
          case "alix martinez":
          case "alix martínez":
            response += Artists['MARTINEZ'];
            break;
          case "friendred":
            response += Artists['FRIENDRED'];
            break;
          case "howard":
          case "howard melnyczuk":
            response += Artists['MELNYCZUK'];
            break;
          case "soon":
          case "soon park":
            response += Artists['SOON'];
            break;
          case "nadia":
          case "nadia rahat":
            response += Artists['RAHAT'];
            break;
          case "sabrina":
          case "sabrian recoules quang":
            response += Artists['RECOULES_QUANG'];
            break;
          case "lius":
          case "lius rubim":
            response += Artists['RUBIM'];
            break;
          case "yeoul":
          case "yeoul son":
            response += Artists['SON'];
            break;
          case "andrew":
          case "andrew thompson":
            response += Artists['THOMPSON'];
            break;

          default:
            response += Artists['UNDEFINED'];
            break;
        }

        if(response !== "") {
          T.post('statuses/update', {
            status                    : response,
            in_reply_to_status_id     : tweetID
          }, function(err, data, response) {
            if(err) {
              console.log("Error posting tweet:");
              console.log(err);
            } else {
              console.log("Reply posted! {");
              console.log("  status: " + response);
              console.log("  in_reply_to_status_id: " + tweetID);
              console.log("}");
              //console.log(data);
            }
          })
        } 
      }
    });
  },
  
  exit        : function () {
    T.stream.stop();
  }
}