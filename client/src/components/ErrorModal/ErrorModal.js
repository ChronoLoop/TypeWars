import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useGameContext } from '../../contexts/GameContext';

const ErrorModal = () => {
    const { resetGameState, hasServerError } = useGameContext();
    const history = useHistory();

    const onHideModal = () => {
        resetGameState();
        history.push('/');
    };

    const error = {
        title: 'Error',
        msg:
            'An error has occured on the server. You will be redirected to the home page after closing this modal.'
    };
    return (
        <Modal onHide={onHideModal} show={hasServerError} centered animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>{error.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{error.msg}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onHideModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;
