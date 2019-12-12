import { ADD_ITEM, DELETE_ITEM, SET_ITEMS, UPDATE_ITEM } from './actionTypes'

export const addItem = (item) => {
    return {
        type: ADD_ITEM,
        item
    }
}

export const deleteItem = (item) => {
    return {
        type: DELETE_ITEM,
        item
    }
}

export const setItems = (items) => {
    return {
        type: SET_ITEMS,
        items
    }
}

export const updateItem = (item) => {
    return {
        type: UPDATE_ITEM,
        item
    }
}