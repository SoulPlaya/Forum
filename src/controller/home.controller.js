/**
 * GET handler for the homepage
 * @param {AppContext} ctx
 */
async function getHome(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/login')
        return
    }

    await ctx.defaultRender('home','Home', null)
}

module.exports = {
    getHome,
}
