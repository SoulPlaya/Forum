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

    // A user ID is available; fetch the associated user and assign ctx.user
    // TODO Fetch user and assign ctx.user
    // Use can use a function in users.model.js to do it.
    // Make sure to check if the return value is null!
    // If all is well, set ctx.isLoggedIn to true

    await next()
}

module.exports = authMiddleware
