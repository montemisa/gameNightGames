import axios from 'axios';

const BASE_URL = 'https://je1iw7ddle.execute-api.us-west-2.amazonaws.com';

export const createGame = async (sessionId: string, displayName: string) => {
    try {
        const resp = await axios.post(BASE_URL + '/createGame', {sessionId, displayName});
        console.log(resp);
        return resp.data;
    } catch(e) {
        console.log(e);
        return {};
    }
};

export const joinGame = async (sessionId: string, gameId: string) => {
    
}