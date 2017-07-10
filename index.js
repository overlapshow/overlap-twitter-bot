// Dependencies =========================
var twitter = require('./src/Twitter.js');

require('dotenv').config()

twitter.init();
twitter.setupStream();

process.on('exit', function () {
  twitter.exit();
})
