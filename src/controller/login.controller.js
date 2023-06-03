const { logOutRequest } = require("../util/user.util")

/**
 * GET handler for the login page
 * @param {AppContext} ctx
 */
async function getLogin(ctx) {
    // TODO You should probably redirect to the homepage if the user is already logged in

    const name = ctx.query.name || 'Anonymous'

    await ctx.render('login', { pageTitle: 'Log In', errorMessage: null })
}

/**
 * POST handler for the login page
 * @param {AppContext} ctx 
 */
async function postLogin(ctx) {
    // TODO You should probably redirect to the homepage if the user is already logged in

    // TODO This needs to be rewritten to use the DB.
    // Check out user.util.js for some possibly useful utils for this.

    const username = ctx.request.body.username
    const password = ctx.request.body.password

    if (password === 'IceCold') {
        ctx.session.username = username
        ctx.session.loggedIn = true
        ctx.redirect('/')
    } else {
        await ctx.render('login', { pageTitle: 'Log In', errorMessage: 'Ur GAY' })
    }
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
