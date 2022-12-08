import axios from 'axios';

const BASE_URL = 'https://je1iw7ddle.execute-api.us-west-2.amazonaws.com';

export const createSession = async () => {
    const resp = await axios.post(BASE_URL + '/createSession');
    console.log(resp);
    return resp.data;
};

export const validateSession = async (sessionId: string) => {
    try {
    const resp = await axios.post(BASE_URL + '/validateSession', {sessionId})
    console.log(resp);
    return true;
    } catch (e) {
        console.log(e);
        return false
    }

};