export const decodeToken = (token) => {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
}

export const tokenExpired = (token) => {
    const tokenExpiry = decodeToken(token).exp
    const currentTime = Math.round((new Date()).getTime() / 1000)
    return currentTime > tokenExpiry
}