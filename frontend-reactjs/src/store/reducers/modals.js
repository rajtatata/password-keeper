import { SHOW_TOP_MODAL, SHOW_CENTERED_MODAL, HIDE_TOP_MODAL, HIDE_CENTERED_MODAL, SET_TOP_MODAL_CONTENT, SET_CENTERED_MODAL_CONTENT } from '../actions/actionTypes'

const initialState = {
    topModal: {
        shown: false,
        title: null,
        body: null,
        buttons: null
    },
    centeredModal: {
        shown: false,
        title: null,
        body: null,
        buttons: null
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_TOP_MODAL:
            return {
                ...state,
                topModal: {
                    ...state.topModal,
                    shown: true
                }
            }
        case HIDE_TOP_MODAL:
            return {
                ...state,
                topModal: {
                    ...state.topModal,
                    shown: false
                }
            }
        case SET_TOP_MODAL_CONTENT:
            return {
                ...state,
                topModal: {
                    ...state.topModal,
                    title: action.title,
                    body: action.body,
                    buttons: action.buttons
                }
            }
        case SHOW_CENTERED_MODAL:
            return {
                ...state,
                centeredModal: {
                    ...state.centeredModal,
                    shown: true
                }
            }
        case HIDE_CENTERED_MODAL:
            return {
                ...state,
                centeredModal: {
                    ...state.centeredModal,
                    shown: false
                }
            }
        case SET_CENTERED_MODAL_CONTENT:
            return {
                ...state,
                centeredModal: {
                    ...state.centeredModal,
                    title: action.title,
                    body: action.body,
                    buttons: action.buttons
                }
            }
        default:
            return state
    }
}

export default reducer