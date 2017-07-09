// Dependencies =========================
var config    = require('./config/config.js'),
    twitter   = require('./src/Twitter.js');

twitter.init(config);
twitter.setupStream();

process.on('exit', function () {
  twitter.exit();
})