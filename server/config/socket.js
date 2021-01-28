const getRandomQuote = require('../helper/randomQuote');
const Game = require('../model/game');
const { calculateWPM, calculateTime, formatPlayerName } = require('../helper/game');

// const logMsg = (msg) => {
//     console.log(msg);
// };

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

const socketConfig = (socketIo, server, corsOptions) => {
    const io = socketIo(server, { cors: corsOptions });

    io.on('connection', (socket) => {
        const handleSocketError = () => {
            socket.emit('error', SERVER_ERROR);
        };
        const handleJoinError = () => {
            socket.emit('error', JOIN_ERROR);
        };

        const startGameClock = async (gameID) => {
            // get the game
            let game = await Game.findById(gameID);
            // get time stamp of when the game started
            game.startTime = new Date().getTime();
            // save the game
            game = await game.save();
            // initial remaining game time
            let time = 120;
            // Start game clock
            const timerID = setInterval(() => {
                // keep countdown going
                if (time >= 0) {
                    const formatTime = calculateTime(time);
                    io.to(gameID).emit('timer', {
                        countDown: formatTime,
                        message: 'Time Remaining:'
                    });
                    time -= 1;

                    (async () => {
                        // get time stamp of when the game ended
                        const endTime = new Date().getTime();
                        // find the game
                        game = await Game.findById(gameID);
                        // get the game start time
                        const { startTime } = game;
                        // calculate all players WPM who haven't finished typing out sentence
                        game.players.forEach((player, index) => {
                            game.players[index].WPM = calculateWPM(endTime, startTime, player);
                        });
                        // save the game
                        const updatedGame = await game.save();
                        io.to(gameID).emit('update-game', updatedGame);
                    })();
                }
                // game clock has run out, game is over
                else {
                    (async () => {
                        // get time stamp of when the game ended
                        const endTime = new Date().getTime();
                        // find the game
                        game = await Game.findById(gameID);
                        // get the game start time
                        const { startTime } = game;
                        // game is officially over
                        game.isOver = true;
                        // calculate all players WPM who haven't finished typing out sentence
                        game.players.forEach((player, index) => {
                            game.players[index].WPM = calculateWPM(endTime, startTime, player);
                        });
                        // save the game
                        const updatedGame = await game.save();
                        // send updated game to all sockets within game
                        io.to(gameID).emit('update-game', updatedGame);
                        clearInterval(timerID);
                    })();
                }
            }, 1000);
        };

        // sockets
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
                    nickName: formatPlayerName(nickName, game)
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

        socket.on('join-game', async ({ nickName, gameID: joinId }) => {
            try {
                const game = await Game.findById(joinId);
                if (game && game.isOpen) {
                    const gameID = game._id.toString();
                    socket.join(gameID);
                    const player = {
                        socketID: socket.id,
                        nickName: formatPlayerName(nickName, game)
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

        socket.on('timer', async ({ gameID, playerID }) => {
            try {
                // time in seconds
                let countDown = 5;
                const game = await Game.findById(gameID);
                // find player who made request
                const player = game.players.id(playerID);
                // check if player has permission to start game
                if (player.isPartyLeader) {
                    // start time countdown
                    const timerID = setInterval(async () => {
                        // close game so no one else can join
                        game.isOpen = false;
                        // save the game
                        const updatedGame = await game.save();
                        // send updated game to all sockets within game
                        io.to(gameID).emit('update-game', updatedGame);
                        // keep counting down until we hit 0
                        if (countDown >= 0) {
                            // emit countDown to all players within game
                            io.to(gameID).emit('timer', { countDown, message: 'Countdown:' });
                            countDown -= 1;
                        }
                        // start game clock
                        else {
                            // start game clock
                            startGameClock(gameID);
                            clearInterval(timerID);
                        }
                    }, 1000);
                }
            } catch {
                handleSocketError();
            }
        });

        // handle when players leave
        socket.on('player-left', async ({ gameID }) => {
            try {
                console.log('player-left');
            } catch {
                handleSocketError();
            }
        });
    });
};

module.exports = socketConfig;
