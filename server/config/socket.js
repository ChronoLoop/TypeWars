const getRandomQuote = require('../helper/randomQuote');
const Game = require('../model/game');

const socketConfig = (socketIo, server, corsOptions) => {
    const io = socketIo(server, { cors: corsOptions });
    io.on('connection', (socket) => {
        socket.on('create-game', async (data) => {
            try {
                console.log(data);
            } catch {
                console.log('error');
            }
        });
    });
};

module.exports = socketConfig;
