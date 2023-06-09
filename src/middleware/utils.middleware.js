/**
 * Middleware that attaches various utilities to the context object
 * @param {AppContext} ctx
 * @param {NextFunction} next
 */
async function utilsMiddleware(ctx, next) {
    ctx.defaultRender = async function (template, pageTitle, errorMessage, extraData) {
        // Use an empty object if the provided data isn't an object
        const data = typeof extraData === 'object' ? extraData : {}
        
        data.pageTitle = pageTitle
        data.errorMessage = errorMessage
        data.user = ctx.user
        data.isLoggedIn = ctx.isLoggedIn

        await ctx.render(template, data)
    }

    await next()
}

module.exports = utilsMiddleware
