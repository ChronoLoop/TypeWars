import React, { useState, useEffect } from 'react';
import socket from '../../config/socket';

const initaialTimerState = { countDown: 'N/A', message: 'Countdown:' };

const CountDown = ({ isGameOver }) => {
    const [timer, setTimer] = useState(initaialTimerState);

    useEffect(() => {
        if (!isGameOver) {
            socket.on('timer', (data) => {
                setTimer(data);
            });
            socket.on('done', () => {
                socket.removeListener('timer');
            });
            //reset timer
            setTimer(initaialTimerState);
        }
        //if game is over remove listeners and reset sockets
        return () => {
            socket.removeListener('timer');
            socket.removeListener('done');
        };
    }, [isGameOver]);

    return (
        <>
            <h3>{`${timer.message} ${timer.countDown}`}</h3>
        </>
    );
};

export default CountDown;
