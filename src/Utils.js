module.exports = {
  sanitze: function (text) {
    var result = text.toLowerCase()
                     .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ');
    return result;
  }
}