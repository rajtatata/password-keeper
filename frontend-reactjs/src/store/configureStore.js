import { createStore, combineReducers } from 'redux'

import auth from './reducers/auth'
import items from './reducers/items'
import modals from './reducers/modals'

const rootReducer = combineReducers({
    auth,
    items,
    modals
})

const saveToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem('state', serializedState)
    } catch (e) {
        console.log(e)
    }
}

const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('state')
        if (serializedState === null) return undefined
        return JSON.parse(serializedState)
    } catch (e) {
        console.log(e)
        return undefined
    }
}

const persistedState = loadFromLocalStorage()

const configureStore = () => {
    const store = createStore(
        rootReducer,
        persistedState
    )
    store.subscribe(() => saveToLocalStorage(store.getState()))
    return store
}

export default configureStore