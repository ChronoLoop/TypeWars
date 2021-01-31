import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import socket from '../../config/socket';

const StartButton = ({ player, gameID, isGameOver, ...props }) => {
    const [showBtn, setShowBtn] = useState(true);
    const { isPartyLeader } = player;
    const onClickStart = () => {
        socket.emit('timer', { playerID: player._id, gameID });
        setShowBtn(false);
    };

    //show start button after game is reset
    useEffect(() => {
        if (!isGameOver) {
            setShowBtn(true);
        }
    }, [isGameOver]);

    return showBtn && isPartyLeader && !isGameOver ? (
        <Button size="lg" variant="primary" onClick={onClickStart} {...props}>
            Start Game
        </Button>
    ) : null;
};

export default StartButton;
