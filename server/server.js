const IN_PROD = process.env.NODE_ENV === 'production';
if (!IN_PROD) {
    // eslint-disable-next-line global-require,  import/no-extraneous-dependencies
    const dotenv = require('dotenv');
    dotenv.config();
}
// env
const PORT = process.env.PORT || 5000;
const { DATABASE_URL } = process.env;

// imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const path = require('path');
const dbConfig = require('./config/database');
const socketConfig = require('./config/socket');

// only permit local (during dev) or website to resources
const corsOptions = {
    origin: IN_PROD ? 'https://typewars-kevin.herokuapp.com' : 'http://localhost:3000'
};
const app = express();
app.use(cors(corsOptions));

if (IN_PROD) {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}
const server = app.listen(PORT);
// config socket
socketConfig(socketIo, server, corsOptions);
// config database
dbConfig(mongoose, DATABASE_URL);
