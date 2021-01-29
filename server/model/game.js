const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    currentWordIndex: {
        type: Number,
        default: 0
    },
    socketID: { type: String },
    isPartyLeader: { type: Boolean, default: false },
    WPM: { type: Number, default: -1 },
    finishedTyping: { type: Boolean, default: false },
    nickName: { type: String }
});

const GameSchema = new mongoose.Schema({
    words: [{ type: String }],
    isOpen: { type: Boolean, default: true },
    isOver: { type: Boolean, default: false },
    players: [PlayerSchema],
    startTime: { type: Number },
    // expire after 1 hr
    createdAt: { type: Date, expires: 60 * 60, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
