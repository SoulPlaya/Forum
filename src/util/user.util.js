const { User } = require("../model/users.model")

/**
 * Logs out the provided request context
 * @param {AppContext} ctx The request context to log out
 */
function logOutRequest(ctx) {
    ctx.isLoggedIn = false
    ctx.user = null
    ctx.session.userId
}

/**
 * Logs in the provided request context as the specified user
 * @param {AppContext} ctx The request context to log in
 * @param {User} user The user to log in as
 */
function logInRequest(ctx, user) {
    ctx.session.userId = user.id
    ctx.isLoggedIn = true
    ctx.user = user
}

/**
 * Creates a new user
 * @param {string} username The new user's username
 * @param {string} password The new user's password
 * @returns {Promise<User>} The newly created user
 */
async function createUser(username, password) {
    // TODO Hash the password and then use users.model.js to create a new user in the DB
}

module.exports = {
    logOutRequest,
    logInRequest,
    createUser,
}
