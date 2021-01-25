const axios = require('axios');

const QUOTE_URI = 'http://api.quotable.io/random?minLength=150';

const getRandomQuote = () => {
    return axios.get(QUOTE_URI).then((response) => response.data.content.split(' '));
};

module.exports = getRandomQuote;
