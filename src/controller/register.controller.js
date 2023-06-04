const { getUserByUsername } = require("../model/users.model")
const { logOutRequest, createUser, logInRequest } = require("../util/user.util")

/**
 * GET handler for the login page
 * @param {AppContext} ctx
 */
async function getRegister(ctx) {
    if (ctx.isLoggedIn === true) {
        ctx.redirect('/')
        return
    }

    await ctx.render('register', { pageTitle: 'Register', errorMessage: null })
}

/**
 * POST handler for the login page
 * @param {AppContext} ctx 
 */
async function postRegister(ctx) {
    if (ctx.isLoggedIn === true) {
        ctx.redirect('/')
        return
    }

    // TODO Check if account with same username already exists
    // If so, show message about it and return
    // If not, continue and create account
    // After successful account creation, check user.util.js for a login method that you can use
    // Finally, redirect to /

    const username = ctx.request.body.username
    const password = ctx.request.body.password

    if (username.length > 16) {
        await ctx.render('register', { pageTitle: 'Register', errorMessage: 'Too long of username lol try again dipshit kys' })
        return
    }

    const existingUser = await getUserByUsername(username)

    if (existingUser !== null) {
        await ctx.render('register', { pageTitle: 'Register', errorMessage: 'Username taken!' })
        return
    }

    const newUser = await createUser(username, password)

    logInRequest(ctx, newUser)
    
    ctx.redirect('/')
}

module.exports = {
    getRegister,
    postRegister,
}
