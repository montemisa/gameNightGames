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

export const joinGame = async (sessionId: string, gameId: string, displayName: string) => {
    try {
        const resp = await axios.post(BASE_URL + '/joinGame', {sessionId, displayName, gameId});
        console.log(resp);
        return resp.data;
    } catch(e) {
        console.log(e);
        return {};
    }
} 

export const startGame = async (sessionId:string, gameId: string, customWord: string) => {
    try {
        const resp = await axios.post(BASE_URL + '/startGame', {sessionId, gameId, customWord});
        console.log(resp);
        return resp.data;
    } catch(e) {
        console.log(e);
        return {};
    }
}