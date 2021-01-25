import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { GiKeyboard } from 'react-icons/gi';
import socket from '../../config/socket';
import './CreateMenu.scss';

const CreateMenu = () => {
    const [nickName, setNickName] = useState('');

    const onChange = (e) => {
        const { value } = e.target;
        setNickName(value);
    };
    const onSubmit = (e) => {
        e.preventDefault();
        socket.emit('create-game', nickName);
    };

    return (
        <div className="create-game mt-5">
            <GiKeyboard size={70} />
            <h1>Create Game</h1>
            <Form onSubmit={onSubmit}>
                <Form.Group controlId="nickName">
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter nickname"
                        onChange={onChange}
                        value={nickName}
                    />
                </Form.Group>
                <Button block size="lg" type="submit">
                    Create
                </Button>
            </Form>
        </div>
    );
};

export default CreateMenu;
