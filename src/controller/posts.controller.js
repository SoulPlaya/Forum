/**
 * GET handler for the posts page
 * @param {AppContext} ctx
 */
async function getPosts(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/login')
        return
    }

    await ctx.defaultRender('Posts', 'Posts', null)
}

module.exports = {
    getPosts,
}
