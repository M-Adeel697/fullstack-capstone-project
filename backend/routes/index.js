const natural = require('natural');

// Simple utility using the natural package to tokenize and compare search terms
const tokenizer = new natural.WordTokenizer();

function tokenize(text) {
  return tokenizer.tokenize(text.toLowerCase());
}

function stem(word) {
  return natural.PorterStemmer.stem(word);
}

module.exports = { tokenize, stem };
