exports.parseUser = (user) => {
    return {
        username: user.username,
        password: user.password,
        email: user.email
    }
}

exports.parseItem = (item) => {
    return {
        username: item.username,
        description: item.description,
        encryptedPass: item.encryptedPass,
        nonce: item.nonce,
    }
}