// Dependencies =========================
var twit      = require('twit'),
    Artists   = require('./Artists.js'),
    Utils     = require('./Utils.js');

// Local Variables ======================
var T         = null,
    username  = "";

module.exports = {
  init        : function (config) {
    T = new twit({
      consumer_key:         config.CONSUMER_KEY,
      consumer_secret:      config.CONSUMER_SECRET,
      access_token:         config.ACCESS_TOKEN_KEY,
      access_token_secret:  config.ACCESS_TOKEN_SECRET,
      timeout_ms:           60*1000,
    });
    username = config.USERNAME;
  },
  
  setupStream : function () {
    var stream = T.stream('statuses/filter', {track: '@'+username});
    
    stream.on('tweet', function (tweet) {
      console.log(tweet);
    });
  },
  
  exit        : function () {
    T.stream.stop();
  }
}

function onTweet (tweet) {
  message = Utils.sanitze(tweet.text);
  
  if(message.substring(0, 13) === "tell me about ") {
    var name      = contents.substring(14),
        response  = "";
    
    switch(name) {
      case "thalia":
      case "thalia agroti":  
        response = Artists['AGROTI'];
        break;
      case "eleni":
      case "eleni alexandri":
        response = Artists['ALEXANDRI'];
        break;
      case "arturas":
      case "arturas bondarciukas":
        response = Artists['BONDARCIUKAS'];
        break;
      case "amy":
      case "amy cartwright":
        response = Artists['CARTWRIGHT'];
        break;
      case "charlotte":
      case "charlotte dann":
        response = Artists['DANN'];
        break;
      case "laura":
      case "laura dekker":
        response = Artists['DEKKER'];
        break;
      case "diane":
      case "diane edwards":
        response = Artists['EDWARDS'];
        break;
      case "saskia":
      case "saskia freeke":
        response = Artists['FREEKE'];
        break;
      case "miduo":
      case "miduo gao":
        response = Artists['GAO'];
        break;
      case "jakob":
      case "jakob glock":
        response = Artists['GLOCK'];
        break;
      case "georgios":
      case "georgios greekalogerakis":
        response = Artists['GREEKALOGERAKIS'];
        break;
      case "jayson":
      case "jayson haebich":
        response = Artists['HAEBICH'];
        break;
      case "jade":
      case "jade hall smith":
        response = Artists['HALL_SMITH'];
        break;
      case "freddie":
      case "freddie hong":
        response = Artists['HONG'];
        break;
      case "ewa":
      case "ewa justka":
        response = Artists['JUSTKA'];
        break;
      case "natthakit":
      case "natthakit kangsadansenanon":
        response = Artists['KANGSADANSENANON'];
        break;
      case "mehrbano":
      case "mehrbano khattak":
        response = Artists['KHATTAK'];
        break;
      case "philip":
      case "philip liu":
        response = Artists['LIU'];
        break;
      case "alix":
      case "alix martinez":
      case "alix martínez":
        response = Artists['MARTINEZ'];
        break;
      case "friendred":
        response = Artists['FRIENDRED'];
        break;
      case "howard":
      case "howard melnyczuk":
        response = Artists['MELNYCZUK'];
        break;
      case "soon":
      case "soon park":
        response = Artists['SOON'];
        break;
      case "nadia":
      case "nadia rahat":
        response = Artists['RAHAT'];
        break;
      case "sabrina":
      case "sabrian recoules quang":
        response = Artists['RECOULES_QUANG'];
        break;
      case "lius":
      case "lius rubim":
        response = Artists['RUBIM'];
        break;
      case "yeoul":
      case "yeoul son":
        response = Artists['SON'];
        break;
      case "andrew":
      case "andrew thompson":
        response = Artists['THOMPSON'];
        break;
        
      default:
        response = Artists['UNDEFINED'];
        break;
    }
    
    if(response !== "") {
      T.post('statuses/update', {status: response}, function(err, data, response) {
        if(err) {
          console.log("Error posting tweet:");
          console.log(err);
        } else {
          console.log(data);
        }
      })
    } 
  }
}