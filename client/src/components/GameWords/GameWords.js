import React from 'react';
import './GameWords.scss';

const GameWords = ({ player, words }) => {
    const { currentWordIndex } = player;
    const wordsCompleted = (words, currentWordIndex) => {
        const completedWords = words.slice(0, currentWordIndex).join(' ');
        console.log(completedWords);
        return completedWords;
    };

    const wordsIncompleted = (words, currentWordIndex) => {
        const incompletedWords = words.slice(currentWordIndex + 1, words.length).join(' ');
        return incompletedWords;
    };

    return (
        <div className="game-words-container">
            <span className="words-completed">{wordsCompleted(words, currentWordIndex) + ' '}</span>
            <span className="current-word">{words[currentWordIndex]}</span>
            <span className="words-incompleted">
                {' ' + wordsIncompleted(words, currentWordIndex)}
            </span>
        </div>
    );
};

export default GameWords;
