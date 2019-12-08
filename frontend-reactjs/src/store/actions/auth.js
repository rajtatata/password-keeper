import { SET_LOGIN_TOKEN } from './actionTypes'

export const setLoginToken = (token) => {
    return {
        type: SET_LOGIN_TOKEN,
        token: token ? "Bearer " + token : token
    }
}
