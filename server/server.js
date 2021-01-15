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
const mongoose = require('mongoose');
const socketio = require('socket.io');
const path = require('path');
const dbConfig = require('./config/database');

const app = express();

if (IN_PROD) {
    // Serve any static files
    app.use(express.static(path.join(__dirname, '../client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}
const expressServer = app.listen(PORT);
const ioServer = socketio(expressServer);
// config database
dbConfig(mongoose, DATABASE_URL);
