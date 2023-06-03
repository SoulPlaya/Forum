/**
 * GET handler for the profile editor page
 * @param {AppContext} ctx 
 * @param {NextFunction} next 
 */
async function getProfileEditor(ctx, next) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/login')
        return
    }

    await ctx.render('profileEditor', { pageTitle: 'Profile editor' })
}

/**
 * POST handler for the profile editor page
 * @param {AppContext} ctx 
 * @param {NextFunction} next 
 */
async function postProfileEditor(ctx, next) {
    // TODO Rewrite this to use database
    // Also, this doesn't check if the user is logged in,
    // which is a security risk.
    // People can manually send a POST request even without
    // having made a GET request to it, so the protection in
    // getProfileEditor is not enough.
    // We'll set up a protection middleware later to make this easier.

    const aboutMe = ctx.request.body.aboutMe
    const affiliation  = ctx.request.body.affiliation
    const name = ctx.request.body.name

    if (aboutMe !== '') {
        ctx.session.aboutMe = aboutMe
    }

    if (affiliation !== '') {
        ctx.session.affiliation = affiliation
    }

    if (name !== '') {
        ctx.session.name = name
    }

    await ctx.render('profileEditor', { pageTitle: 'Profile editor' })
}

module.exports = {
    getProfileEditor,
    postProfileEditor,
}
