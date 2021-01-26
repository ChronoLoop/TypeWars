const getRandomQuote = require('../helper/randomQuote');
const Game = require('../model/game');

const socketConfig = (socketIo, server, corsOptions) => {
    const io = socketIo(server, { cors: corsOptions });

    io.on('connection', (socket) => {
        const SERVER_ERROR = {
            hasError: true,
            reset: true,
            message:
                'An error has occured on the server. You will be redirected to the home page after closing this modal.'
        };
        const JOIN_ERROR = {
            hasError: true,
            reset: false,
            message: 'The game could not be join. Please try a different game ID.'
        };

        const handleSocketError = () => {
            socket.emit('error', SERVER_ERROR);
        };
        const handleJoinError = () => {
            socket.emit('error', JOIN_ERROR);
        };
        const getPlayerName = (name, game) => {
            // if player didn't input a name
            if (name.length <= 0) {
                return `Guest ${game.players.length}`;
            }
            return name;
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
                    nickName: getPlayerName(nickName, game)
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

        socket.on('join-game', async ({ nickName, gameId: joinId }) => {
            try {
                const game = await Game.findById(joinId);
                if (game && game.isOpen) {
                    const gameID = game._id.toString();
                    socket.join(gameID);
                    const player = {
                        socketID: socket.id,
                        nickName: getPlayerName(nickName, game)
                    };
                    // add new player to game if socket Id doesnt already exist in game
                    if (
                        game.players.length &&
                        !game.players.some((p) => p.socketID === socket.id)
                    ) {
                        game.players.push(player);
                    }
                    const updatedGame = await game.save();
                    // send updated game to all sockets within game
                    io.to(gameID).emit('update-game', updatedGame);
                } else {
                    handleJoinError();
                }
            } catch {
                handleJoinError();
            }
        });
    });
};

module.exports = socketConfig;
