/**
 * Middleware that logs incoming requests to the console
 * @param {AppContext} ctx
 * @param {NextFunction} next
 */
async function loggerMiddleware(ctx, next) {
    console.log(`${ctx.method} ${ctx.path}`)
    await next()
}

module.exports = loggerMiddleware
