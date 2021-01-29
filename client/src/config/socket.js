import io from 'socket.io-client';

const ENDPOINT = 'https://typewars-kevin.herokuapp.com/';
const socket = io(ENDPOINT);

export default socket;
