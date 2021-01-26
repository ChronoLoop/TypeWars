import React, { useContext, useState, useEffect } from 'react';
import socket from '../config/socket';

const ErrorContext = React.createContext();

export const useErrorContext = () => {
    return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
    const initialState = { hasError: false, reset: false, message: '' };
    const [serverError, setServerError] = useState(initialState);

    useEffect(() => {
        socket.on('error', (res) => {
            const { hasError, reset, message } = res;
            setServerError({ hasError, reset, message });
        });
        return () => {
            socket.removeListener('error');
        };
    }, []);

    const resetError = () => {
        setServerError(initialState);
    };

    return (
        <ErrorContext.Provider value={{ serverError, resetError }}>
            {children}
        </ErrorContext.Provider>
    );
};
