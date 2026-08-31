const quotes = require('./quotes.json');

const getRandomQuote = () => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    return quote.quote.split(' ');
};

module.exports = getRandomQuote;
