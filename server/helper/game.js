const formatPlayerName = (name, game) => {
    // if player didn't input a name
    if (name.length <= 0) {
        return `Guest ${game.players.length}`;
    }
    return name;
};

const calculateTime = (time) => {
    // time is in seconds
    // convert it into minutes and seconds
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const calculateWPM = (endTime, startTime, player) => {
    const numOfWords = player.currentWordIndex;
    const timeInSeconds = (endTime - startTime) / 1000;
    const timeInMinutes = timeInSeconds / 60;
    const WPM = Math.floor(numOfWords / timeInMinutes);
    return WPM;
};

module.exports = { calculateWPM, calculateTime, formatPlayerName };
