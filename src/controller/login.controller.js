const { logOutRequest, logInRequest } = require('../util/user.util')
const argon2 = require('argon2')
const { getUserByUsername } = require("../model/users.model")

/**
 * GET handler for the login page
 * @param {AppContext} ctx
 */
async function getLogin(ctx) {
    if (ctx.isLoggedIn === true) {
        ctx.redirect('/')
        return
    }

    await ctx.render('login', { pageTitle: 'Log In', errorMessage: null })
}

/**
 * POST handler for the login page
 * @param {AppContext} ctx 
 */
async function postLogin(ctx) {
    // TODO You should probably redirect to the homepage if the user is already logged in

    // TODO This needs to be rewritten to use the DB.
    // Check out user.util.js for some possibly useful utils for this
    if (ctx.isLoggedIn === true) {
        ctx.redirect('/')
        return
    }

    const username = ctx.request.body.username
    const password = ctx.request.body.password

    const user = await getUserByUsername(username)

    if (user === null) {
        await ctx.render('login', { pageTitle: 'Log In', errorMessage: 'Ur GAY' })
        return
    }

    const matched = await argon2.verify(user.passwordHash, password)
    if (!matched) {
        await ctx.render('login', { pageTitle: 'Log In', errorMessage: 'Ur GAY' })
        return
    }

    logInRequest(ctx, user)

    ctx.redirect('/')
}

/**
 * GET handler for the logout route
 * @param {AppContext} ctx 
 */
async function getLogout(ctx) {
    logOutRequest(ctx)
    ctx.redirect('/login')
}

module.exports = {
    getLogin,
    postLogin,
    getLogout,
}
