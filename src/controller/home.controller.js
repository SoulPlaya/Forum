/**
 * GET handler for the homepage
 * @param {AppContext} ctx
 */
async function getHome(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/login')
        return
    }

    await ctx.render('home', { pageTitle: 'Home', username: ctx.user.username })
}

module.exports = {
    getHome,
}
