import React, { useRef, useState } from 'react';
import './GameCode.scss';
import { InputGroup, FormControl, Button, Alert } from 'react-bootstrap';

const GameCode = ({ gameID }) => {
    const inputRef = useRef(null);
    const [showAlert, setShowAlert] = useState(false);
    const onClickCopy = () => {
        inputRef.current.select();
        document.execCommand('copy');
        setShowAlert(true);
    };
    return (
        <div className="game-code-container">
            <h5>Send this code to your friends for them to join</h5>
            <InputGroup>
                <FormControl value={gameID} readOnly ref={inputRef} />
                <InputGroup.Append>
                    <Button variant="secondary" onClick={onClickCopy}>
                        Copy Code
                    </Button>
                </InputGroup.Append>
            </InputGroup>
            <Alert show={showAlert} variant="success" className="mt-2 w-100">
                Successfully Copied Code
            </Alert>
        </div>
    );
};

export default GameCode;
