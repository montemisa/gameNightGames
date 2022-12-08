export enum LoadState {
    INIT,
    LOADING,
    LOADED,
    ERROR,
};

export enum GameStatus {
    UNKNOWN,
    LOBBY,
    STARTED,
    FINISHED,
};

export interface PlayerInfo {
    sessionId: string,
    displayName: string,
};

export interface JoinGameRequest {
    sessionId: string,
    displayName: string,
    gameId: string,
};