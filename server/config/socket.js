const getRandomQuote = require('../helper/randomQuote');
const Game = require('../model/game');

const socketConfig = (socketIo, server, corsOptions) => {
    const io = socketIo(server, { cors: corsOptions });

    io.on('connection', (socket) => {
        const handleSocketError = () => {
            socket.emit('game-error', { hasError: true });
        };

        socket.on('create-game', async (nickName) => {
            try {
                // get words for game
                const gameWords = await getRandomQuote();
                // create game
                let game = new Game();
                // set words
                game.words = gameWords;
                // create player
                const player = {
                    socketID: socket.id,
                    isPartyLeader: true,
                    nickName
                };
                // add player to game
                game.players.push(player);
                // save the game
                game = await game.save();
                // make player's socket join the game room
                const gameID = game._id.toString();
                socket.join(gameID);
                // send updated game to all sockets within game
                io.to(gameID).emit('update-game', game);
            } catch {
                handleSocketError();
            }
        });
    });
};

module.exports = socketConfig;
