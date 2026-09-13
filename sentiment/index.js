const natural = require('natural');

const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
const tokenizer = new natural.WordTokenizer();

function analyzeSentiment(text) {
  const tokens = tokenizer.tokenize(text);
  return analyzer.getSentiment(tokens);
}

module.exports = { analyzeSentiment };
