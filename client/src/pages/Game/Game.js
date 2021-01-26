import React from 'react';
import { Redirect } from 'react-router-dom';
import { useGameContext } from '../../contexts/GameContext';

const Game = () => {
    const { gameState } = useGameContext();

    //redirect if user didn't submit create or join form
    if (!gameState._id) {
        return <Redirect to="/" />;
    }
    return (
        <section className="mt-5 p-5">
            <div>Game Page</div>
        </section>
    );
};

export default Game;
