const serverUrl = process.env.REACT_APP_SERVER_URL

export const login = async (username, password) => {
    try {
        const result = await fetch(serverUrl + "/auth/login", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        const parsedResponse = await result.json()

        if (parsedResponse.status === 1) {
            return { token: parsedResponse.token }
        }

        return { error: parsedResponse.message }
    } catch (error) {
        console.log(error)
        return { error: "Error trying to login!" }
    }
}

export const getItems = async (token) => {
    try {
        const result = await fetch(serverUrl + "/item", {
            method: "get",
            headers: {
                'Authorization': token
            }
        })

        const parsedResponse = await result.json()
        if (parsedResponse.status === 1) {
            return { items: parsedResponse.items }
        }

        return { error: parsedResponse.message }
    } catch (error) {
        console.log(error)
        return { error: "Error getting items!" }
    }
}

export const addNewItem = async (token, description, encryptedPass, nonce) => {
    try {
        const result = await fetch(serverUrl + "/item", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                description, encryptedPass, nonce
            })
        })

        const parsedResponse = await result.json()
        if (parsedResponse.status === 1) {
            return { item: parsedResponse.item }
        }

        return { error: parsedResponse.message }
    } catch (error) {
        return { error: "Error adding item!" }
    }
}

export const deleteItem = async (token, itemId) => {
    try {
        const result = await fetch(serverUrl + `/item/${itemId}`, {
            method: "delete",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })

        const parsedResponse = await result.json()
        if (parsedResponse.status === 1) {
            return { status: true }
        }
        return { error: parsedResponse.message }
    } catch (error) {
        return { error: "Error deleting item!" }
    }
}

export const registerUser = async (username, password, email) => {
    try {
        const result = await fetch(serverUrl + "/auth/register", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username, password, email
            })
        })
        const parsedResponse = await result.json()

        if (parsedResponse.status === 1) {
            return { status: true }
        }

        return { error: parsedResponse.message }
    } catch (error) {
        console.log(error)
        return { error: "Error registering user!" }
    }
}

export const updateUserEmail = async (token, email) => {
    try {
        const result = await fetch(serverUrl + "/auth/reset-email", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ email })
        })
        const parsedResponse = await result.json()

        if (parsedResponse.status === 1) {
            return { token: parsedResponse.token }
        }

        return { error: parsedResponse.message }
    } catch (error) {
        console.log(error)
        return { error: "Error updating email!" }
    }
}

export const changeUserPass = async (token, oldPassword, newPassword) => {
    try {
        const result = await fetch(serverUrl + "/auth/changePass", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ oldPassword, newPassword })
        })
        const parsedResponse = await result.json()

        if (parsedResponse.status === 1) {
            return { status: true }
        }

        return { error: parsedResponse.message }
    } catch (error) {
        console.log(error)
        return { error: "Error changing password!" }
    }
}

export const deleteUserAccount = async (token) => {
    try {
        const result = await fetch(serverUrl + "/auth/deleteAccount", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        const parsedResponse = await result.json()

        if (parsedResponse.status === 1) {
            return { status: true }
        }

        return { error: parsedResponse.message }
    } catch (error) {
        console.log(error)
        return { error: "Error deleting account!" }
    }
}