//helper
const findPlayer = (players, socket) => {
    return players.find((player) => player.socketID === socket.id);
};

export { findPlayer };
