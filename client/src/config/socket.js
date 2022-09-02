import io from 'socket.io-client';

const ENDPOINT =
    process.env.NODE_ENV === 'production' ? 'https://typewars.up.railway.app' : 'localhost:5000';
const socket = io(ENDPOINT);

export default socket;
