import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const calculatePercentage = (currentWordIndex, wordsLength) => {
    if (currentWordIndex !== 0) {
        return ((currentWordIndex / wordsLength) * 100).toFixed(2);
    }
    return 0;
};
const PlayersProgress = ({ players, player, wordsLength }) => {
    const currentPlayerPercentage = calculatePercentage(player.currentWordIndex, wordsLength);
    return (
        <>
            {players.map((p) => {
                const playerPercentage = calculatePercentage(p.currentWordIndex, wordsLength);
                //return players that are not our current player
                return p._id !== player._id ? (
                    <div className="my-3" key={p._id}>
                        <h4>{p.nickName}</h4>
                        <ProgressBar now={playerPercentage} label={`${playerPercentage}%`} />
                    </div>
                ) : null;
            })}

            <div className="my-3">
                <h4>{player.nickName + ' (You)'}</h4>
                <ProgressBar now={currentPlayerPercentage} label={`${currentPlayerPercentage}%`} />
            </div>
        </>
    );
};

export default PlayersProgress;
