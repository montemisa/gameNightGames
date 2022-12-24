import axios from 'axios';

const BASE_URL = 'https://5yy2e32bl0.execute-api.us-west-2.amazonaws.com';

export const createGame = async (sessionId: string, displayName: string) => {
    try {
        const resp = await axios.post(BASE_URL + '/chameleon', {sessionId, displayName});
        return resp.data;
    } catch(e) {
        console.log(e);
        return {};
    }
};

export const joinGame = async (sessionId: string, gameId: string, displayName: string) => {
    try {
        const resp = await axios.put(BASE_URL + '/chameleon/' + gameId, {sessionId, displayName});
        return resp.data;
    } catch(e) {
        console.log(e);
        return {};
    }
} 

export const startGame = async (sessionId:string, gameId: string, customWord: string) => {
    try {
        let request: {sessionId: string, customWord?: string} = {sessionId};
        if (customWord.length > 0 ){
            request = {
                ...request,
                customWord
            };
        }
        const resp = await axios.put(BASE_URL + '/chameleon/' + gameId + '/start', request);
        return resp.data;
    } catch(e) {
        console.log(e);
        return {};
    }
}

export const setCustomGameId = async (sessionId:string, gameId: string, customGameId: string) => {
    try {
        const resp = await axios.post(BASE_URL + '/customGameId', {sessionId, gameId, customGameId});
        return resp.data;
    } catch(e) {
        console.log(e);
        return {};
    }
}