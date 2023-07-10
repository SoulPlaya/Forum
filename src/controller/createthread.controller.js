const { createPostRow } = require("../model/posts.model")
const { createThread } = require("../util/post.util")

/**
 * @param {AppContext} ctx
 * @param {string | null} [errorMessage=null]
 * @param {string} [currentTitle='']
 * @param {string} [currentContent='']
 */
async function render(ctx, errorMessage = null, currentTitle = '', currentContent = '') {
    await ctx.defaultRender('createThread', 'Thread Creator', errorMessage, {
        currentTitle,
        currentContent,
    })
}

/**
 * GET handler for the create thread page
 * @param {AppContext} ctx
 */
async function getCreateThread(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/')
        return
    }

    await render(ctx)
}

/**
 * POST handler for the create thread page
 * @param {AppContext} ctx 
 */
async function postCreateThread(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/')
        return
    }

    const title = ctx.request.body['title']
    const content = ctx.request.body['content']
    const file = ctx.request.body['file']

    if (title.length > 50) {
        await render(ctx, 'Too long of title lol try again dipshit kys', title, content)
        return
    }

    if (content.length > 2000) {
        await render(ctx, 'Too long of content lol try again dipshit kys', title, content)
        return
    }

    if (file.length > 255) {
        await render(ctx, 'Your massive file needs to be shrank homie')
    }

    const post = await createThread(title, content, ctx.user.id, file)
    ctx.redirect('/thread/' + post.id)
}

module.exports = {
    getCreateThread,
    postCreateThread,
}
