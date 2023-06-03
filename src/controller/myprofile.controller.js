/**
 * GET handler for the My Profile page
 * @param {AppContext} ctx
 */
async function getMyProfile(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/')
        return
    }

    // TODO
}

module.exports = {
    getMyProfile,
}
