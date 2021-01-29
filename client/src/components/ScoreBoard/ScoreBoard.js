import React from 'react';
import './ScoreBoard.scss';

const getFinishedPlayers = (players) => {
    let finishedPlayers = players.filter((p) => p.finishedTyping);
    finishedPlayers = finishedPlayers.sort((a, b) => {
        //place higher wpm before lower wpm
        if (a.WPM > b.WPM) {
            return -1;
        }
        //place lower wpm after higher wpm
        if (a.WPM < b.WPM) {
            return 1;
        }
        return 0;
    });
    return finishedPlayers;
};

const ScoreBoard = ({ players }) => {
    const finishedPlayers = getFinishedPlayers(players);

    return finishedPlayers.length !== 0 ? (
        <table className="player-table my-5">
            <thead>
                <tr className="table-row-dark">
                    <th scope="col">#</th>
                    <th scope="col">Player</th>
                    <th scope="col">WPM</th>
                </tr>
            </thead>
            <tbody>
                {finishedPlayers.map((player, index) => {
                    return (
                        <tr key={player._id} className="table-row-light">
                            <th scope="col">{index + 1}</th>
                            <th scope="col">{player.nickName}</th>
                            <th scope="col">{player.WPM}</th>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    ) : null;
};

export default ScoreBoard;
