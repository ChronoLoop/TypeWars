import React, { useState, useEffect } from 'react';
import socket from '../../config/socket';

const CountDown = () => {
    const [timer, setTimer] = useState({ countDown: '', message: '' });
    useEffect(() => {
        socket.on('timer', (data) => {
            setTimer(data);
        });
        socket.on('done', () => {
            socket.removeListener('timer');
        });
        return () => {
            socket.removeListener('timer');
            socket.removeListener('done');
        };
    }, []);

    return (
        <>
            <h3>{`${timer.message} ${timer.countDown}`}</h3>
        </>
    );
};

export default CountDown;
