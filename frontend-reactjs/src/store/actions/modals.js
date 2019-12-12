import { HIDE_CENTERED_MODAL, HIDE_TOP_MODAL, SHOW_CENTERED_MODAL, SHOW_TOP_MODAL, SET_CENTERED_MODAL_CONTENT, SET_TOP_MODAL_CONTENT } from './actionTypes'

export const showTopModal = () => {
    return {
        type: SHOW_TOP_MODAL,
    }
}
export const showCenteredModal = () => {
    return {
        type: SHOW_CENTERED_MODAL,
    }
}
export const hideTopModal = () => {
    return {
        type: HIDE_TOP_MODAL,
    }
}
export const hideCenteredModal = () => {
    return {
        type: HIDE_CENTERED_MODAL,
    }
}

export const setTopModalContent = (title, body, buttons) => {
    return {
        type: SET_TOP_MODAL_CONTENT,
        title, body, buttons
    }
}

export const setCenteredModalContent = (title, body, buttons) => {
    return {
        type: SET_CENTERED_MODAL_CONTENT,
        title, body, buttons
    }
}