// Dependencies =========================
var twitter       = require('./src/Twitter.js'),
    twitter_debug = require('./src/Twitter_debug.js');

require('dotenv').config()

if (process.argv[2] === '-d') {
  twitter_debug.init();
  twitter_debug.setupStream();
  process.on('exit', function () {twitter_debug.exit();});
} else {
  twitter.init();
  twitter.setupStream();
  process.on('exit', function () {twitter.exit();});
}