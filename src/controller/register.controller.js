const { getUserByUsername } = require("../model/users.model")
const { logOutRequest, createUser, logInRequest } = require("../util/user.util")

/**
 * GET handler for the login page
 * @param {AppContext} ctx
 */
async function getRegister(ctx) {
    if (ctx.isLoggedIn) {
        ctx.redirect('/')
        return
    }

    await ctx.defaultRender('register', 'Register', null )
}

/**
 * POST handler for the login page
 * @param {AppContext} ctx 
 */
async function postRegister(ctx) {
    if (ctx.isLoggedIn) {
        ctx.redirect('/')
        return
    }

    const username = ctx.request.body.username
    const password = ctx.request.body.password

    if (username.length > 16) {
        await ctx.defaultRender('register', 'Register', 'Too long of username lol try again dipshit kys')
        return
    }

    const existingUser = await getUserByUsername(username)

    if (existingUser !== null) {
        await ctx.defaultRender('register', 'Register', 'Username taken!')
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
