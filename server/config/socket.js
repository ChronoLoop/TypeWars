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
                        // calculate wpm for players that didnt finish in time
                        game.players.forEach((player, index) => {
                            if (!player.finishedTyping) {
                                game.players[index].WPM = calculateWPM(endTime, startTime, player);
                                game.players[index].finishedTyping = true;
                            }
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

        // handle when players leave
        socket.on('player-left', async ({ gameID }) => {
            try {
                const game = await Game.findById(gameID);
                const playerThatLeftParty = game.players.find(
                    (player) => player.socketID === socket.id
                );
                // unsubscribe socket from channel
                socket.leave(gameID);
                // remove player
                game.players = game.players.filter(
                    (player) => player._id !== playerThatLeftParty._id
                );
                // check if party leader has left
                if (playerThatLeftParty.isPartyLeader) {
                    // set next party leader if there are more players
                    if (game.players.length > 0) game.players[0].isPartyLeader = true;
                }

                const updatedGame = await game.save();
                // send updated game to all sockets within game
                io.to(gameID).emit('update-game', updatedGame);
            } catch {
                handleSocketError();
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
                        // keep counting down until we hit 0
                        if (countDown >= 0) {
                            // emit countDown to all players within game
                            io.to(gameID).emit('timer', { countDown, message: 'Countdown:' });
                            countDown -= 1;
                        }
                        // start game clock
                        else {
                            // close game so no one else can join
                            game.isOpen = false;
                            // save the game
                            const updatedGame = await game.save();
                            // send updated game to all sockets within game
                            io.to(gameID).emit('update-game', updatedGame);
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

        socket.on('player-input', async ({ gameID, playerInput }) => {
            try {
                // find the game
                const game = await Game.findById(gameID);
                // if game has started and game isn't over
                if (!game.isOpen && !game.isOver) {
                    // get player making the request
                    const player = game.players.find((p) => p.socketID === socket.id);
                    // check if player is done typing
                    if (!player.finishedTyping) {
                        // get current word the user has to type
                        const word = game.words[player.currentWordIndex];
                        // if player typed word correctly
                        if (word === playerInput) {
                            // advance player to next word
                            player.currentWordIndex += 1;
                            // get timestamp of when the user finished
                            const endTime = new Date().getTime();
                            // get timestamp of when the game started
                            const { startTime } = game;
                            // calculate Words Per Minute
                            player.WPM = calculateWPM(endTime, startTime, player);
                            // if player has finished typing words
                            if (player.currentWordIndex === game.words.length) {
                                player.finishedTyping = true;
                                // stops timer for that player
                                socket.emit('done');
                            }
                            // save game
                            const updatedGame = await game.save();
                            // send updated game to all sockets within game
                            io.to(gameID).emit('update-game', updatedGame);
                        }
                    }
                }
            } catch {
                handleSocketError();
            }
        });
    });
};

module.exports = socketConfig;
