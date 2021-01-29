import React, { useEffect, useState, useRef } from 'react';
import socket from '../../config/socket';

const GameInput = ({ isGameOver, isGameOpen, gameID, finishedTyping }) => {
    const [playerInput, setPlayerInput] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (!isGameOpen) {
            inputRef.current.focus();
        }
    }, [isGameOpen]);

    const resetPlayerInput = () => {
        setPlayerInput('');
    };

    const onChangeInput = (e) => {
        const { value } = e.target;
        let lastChar = value.charAt(value.length - 1);
        if (lastChar === ' ') {
            socket.emit('player-input', { playerInput, gameID });
            resetPlayerInput();
        } else {
            setPlayerInput(value);
        }
    };

    return (
        <>
            <input
                type="text"
                readOnly={isGameOpen || isGameOver || finishedTyping}
                ref={inputRef}
                value={playerInput}
                placeholder={
                    (isGameOpen && 'Type the above text here when the game begins') ||
                    (finishedTyping && 'Finished')
                }
                onChange={onChangeInput}
            />
        </>
    );
};

export default GameInput;
