import { SET_LOGIN_TOKEN } from '../actions/actionTypes'

const initialState = {
    token: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGIN_TOKEN:
            return {
                ...state,
                token: action.token
            }
        default:
            return state
    }
}

export default reducer