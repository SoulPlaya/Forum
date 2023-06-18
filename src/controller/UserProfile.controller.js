const {getUserByUsername} = require('../model/users.model')

async function getUserProfile(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/login')
        return
    }

    //await ctx.defaultRender('UserProfile','UserProfile', null)

    const username = ctx.query.username ? ctx.query.username.trim() : ''

    let userProfile = ctx.user

    if (username !== '') {
        const searchedUser = await getUserByUsername(username)

        if (searchedUser === null) {
            await ctx.defaultRender('UserProfile', 'UserProfile', 'Wizard does not exist', { userProfile })
            return
        }

        userProfile = searchedUser
    }
    
    await ctx.defaultRender('UserProfile', 'UserProfile', null, { userProfile })
}

module.exports = {
    getUserProfile,
}