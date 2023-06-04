const { getUserById } = require("../model/users.model")

/**
 * Middleware that authenticates requests and attaches a User object to them
 * @param {AppContext} ctx 
 * @param {NextFunction} next
 */
async function authMiddleware(ctx, next) {
    // The request starts out unauthenticated
    ctx.user = null
    ctx.isLoggedIn = false

    if (ctx.session.userId === undefined) {
        // No user ID available in request; stop here
        await next()
        return
    }
    
    const user = await getUserById(ctx.session.userId)

    if (user === null) {
        delete ctx.session.userId
        await next()
        return
    }

    ctx.user = user
    ctx.isLoggedIn = true

    await next()
}

module.exports = authMiddleware
