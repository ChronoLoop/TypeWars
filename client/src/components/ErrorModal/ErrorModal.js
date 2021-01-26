import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useErrorContext } from '../../contexts/ErrorContext';
import { useGameContext } from '../../contexts/GameContext';

const ErrorModal = () => {
    const { serverError, resetError } = useErrorContext();
    const { resetGameState } = useGameContext();
    const history = useHistory();

    const onHideModal = () => {
        //reset error state
        resetError();
        //reset game state and go to home
        if (serverError.reset) {
            resetGameState();
            history.push('/');
        }
    };

    return (
        <Modal onHide={onHideModal} show={serverError.hasError} centered animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{serverError.message}</p>
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
