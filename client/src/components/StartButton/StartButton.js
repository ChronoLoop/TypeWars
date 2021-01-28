import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import socket from '../../config/socket';

const StartButton = ({ player, gameID, isGameOver }) => {
    const [showBtn, setShowBtn] = useState(true);
    const { isPartyLeader } = player;
    const onClickStart = () => {
        socket.emit('timer', { playerID: player._id, gameID });
        setShowBtn(false);
    };

    return showBtn && isPartyLeader && !isGameOver ? (
        <div className="d-flex justify-content-center mt-4">
            <Button size="lg" variant="primary" onClick={onClickStart}>
                Start Game
            </Button>
        </div>
    ) : null;
};

export default StartButton;
