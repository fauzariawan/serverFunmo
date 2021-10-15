const jwt = require('jsonwebtoken')

function getToken(payload) {
    const token = jwt.sign(payload, process.env.SECRET)
    return token
}

function verifyToken(token) {
    const decode = jwt.verify(token, process.env.SECRET)
    return decode
}

module.exports = { getToken, verifyToken }