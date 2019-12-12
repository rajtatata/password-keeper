import { ADD_ITEM, DELETE_ITEM, UPDATE_ITEM, SET_ITEMS } from '../actions/actionTypes'

const initialState = {
    list: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ITEMS:
            return {
                ...state,
                list: action.items
            }
        case ADD_ITEM:
            return {
                ...state,
                list: [...state.list, action.item]
            }
        case UPDATE_ITEM:
            return {
                ...state,
                list: state.list.map(t => {
                    if (t.id === action.item.id) {
                        return action.item
                    }
                    return t
                })
            }
        case DELETE_ITEM:
            return {
                ...state,
                list: state.list.filter(t => t.id !== action.item.id)
            }
        default:
            return state
    }
}

export default reducer