import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { GiKeyboard } from 'react-icons/gi';
import './CreateMenu.scss';

const CreateMenu = () => {
    const [nickname, setNickName] = useState('');

    const onChange = (e) => {
        const { value } = e.target;
        setNickName(value);
    };
    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="create-game mt-5">
            <GiKeyboard size={70} />
            <h1>Create Game</h1>
            <Form onSubmit={onSubmit}>
                <Form.Group controlId="nickName">
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control type="text" placeholder="Enter nickname" onChange={onChange} />
                </Form.Group>
                <Button block size="lg" type="submit">
                    Create
                </Button>
            </Form>
        </div>
    );
};

export default CreateMenu;
