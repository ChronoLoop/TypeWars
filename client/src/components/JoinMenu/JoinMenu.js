import React, { useState } from 'react';
import { RiTeamFill } from 'react-icons/ri';
import { Button, Form } from 'react-bootstrap';
import socket from '../../config/socket';
import './JoinMenu.scss';

const JoinMenu = () => {
    const [userInput, setUserInput] = useState({
        gameId: '',
        nickName: ''
    });

    const onChange = (e) => {
        const { name, value } = e.target;
        setUserInput({ ...userInput, [name]: value });
    };
    const onSubmit = (e) => {
        e.preventDefault();
        socket.emit('join-game', userInput);
    };

    return (
        <div className="join-game mt-5">
            <RiTeamFill size={50} className="mb-2" />
            <h1>Join Game</h1>
            <Form onSubmit={onSubmit}>
                <Form.Group controlId="nickName">
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter nickname"
                        onChange={onChange}
                        value={userInput.nickName}
                        name="nickName"
                    />
                </Form.Group>
                <Form.Group controlId="gameId">
                    <Form.Label>Game ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter game ID"
                        onChange={onChange}
                        value={userInput.gameId}
                        name="gameId"
                    />
                </Form.Group>
                <Button block size="lg" type="submit">
                    Join
                </Button>
            </Form>
        </div>
    );
};

export default JoinMenu;
