import axios from 'axios';

const BASE_URL = 'https://5yy2e32bl0.execute-api.us-west-2.amazonaws.com';

export const createSession = async () => {
    const resp = await axios.post(BASE_URL + '/session');
    console.log(resp);
    return resp.data;
};

export const validateSession = async (sessionId: string) => {
    try {
    const resp = await axios.post(BASE_URL + '/session/validate', {sessionId})
    console.log(resp);
    return true;
    } catch (e) {
        console.log(e);
        return false
    }
};

export const createGame = async (sessionId: string, displayName: string) => {
    try {
        const resp = await axios.post(BASE_URL + '/createGame', {sessionId, displayName});
        console.log(resp);
        return resp.data;
    } catch(e) {
        console.log(e);
        return {};
    }
}