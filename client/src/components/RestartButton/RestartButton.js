import React from 'react';
import { Button } from 'react-bootstrap';
import socket from '../../config/socket';

const RestartButton = ({ isGameOver, gameID, player, ...props }) => {
    const { isPartyLeader } = player;
    const onClickStart = () => {
        socket.emit('restart-game', { gameID });
    };

    // useEffect(() => {
    //     if (isGameOver) {
    //         setShowBtn(true);
    //     }
    // }, [isGameOver]);

    return isPartyLeader && isGameOver ? (
        <Button size="lg" variant="danger" onClick={onClickStart} {...props}>
            Restart Game
        </Button>
    ) : null;
};

export default RestartButton;
