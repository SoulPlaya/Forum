const { User, updateUserProfile } = require('../model/users.model')


/**
 * @param {AppContext} ctx
 * @param {string | null} errorMessage
 */
async function render(ctx, errorMessage = null) {
  await ctx.defaultRender('profileEditor', 'Profile editor', null)
}

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

    await render(ctx)
}

/**
 * POST handler for the profile editor page
 * @param {AppContext} ctx 
 * @param {NextFunction} next 
 */
async function postProfileEditor(ctx, next) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/login')
        return
    }

    const aboutMe = ctx.request.body['about-me']
    const skillset  = ctx.request.body['wizard-skillset']
    const displayName = ctx.request.body['display-name']

    if (skillset.length > 250) {
        await render(ctx, 'Too long of skillset lol try again dipshit kys')
        return
    }

    if (aboutMe.length > 1000) {
        await render(ctx, 'Too long of about me lol try again dipshit kys')
        return
    }

    if (displayName.length > 25) {
        await render(ctx, 'Too long of display name lol try again kys')
        return
    }

    await updateUserProfile(ctx.user.id, aboutMe, skillset, displayName)
    ctx.user.aboutMe = aboutMe
    ctx.user.skillset = skillset
    ctx.user.displayName = displayName

    await render(ctx)
}

module.exports = {
    getProfileEditor,
    postProfileEditor,
}
