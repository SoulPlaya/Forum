const { ThreadInfo, Post, getThreadById } = require("../model/posts.model")
const { getReplies } = require("../model/posts.model")
const { broadcast } = require("../service/websocket.service")
const { createReply } = require ("../util/post.util")


/**
 * @param {AppContext} ctx
 * @param {ThreadInfo} thread
 * @param {string | null} [errorMessage=null]
 */
async function render(ctx, thread, errorMessage = null) {
    const replies = await getReplies(thread.id, 0, Number.MAX_SAFE_INTEGER)

    await ctx.defaultRender('singleThread', thread.title, errorMessage, {
        thread,
        replies,
    })
}

/**
 * GET handler for the posts page
 * @param {AppContext} ctx
 * @param {NextFunction} next
 */
async function getSingleThread(ctx, next) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/login')
        return
    }

    const postId = parseInt(ctx.params.id)
    if (isNaN(postId)) {
        await next()
        return
    }

    const thread = await getThreadById(postId)

    if (thread === null) {
        await next()
        return
    }

    await render(ctx, thread)
}

/**
 * POST handler for the posts page, accepts a reply
 * @param {AppContext} ctx
 * @param {NextFunction} next
 */
async function postSingleThread(ctx, next) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/login')
        return
    }

    const postId = parseInt(ctx.params.id)
    if (isNaN(postId)) {
        await next()
        return
    }

    const thread = await getThreadById(postId)

    if (thread === null) {
        await next()
        return
    }

    const reply = ctx.request.body.content

    if (reply.length > 2000) {
        await render(ctx, thread, 'LESS TEXT IN BOX PLEASE')
        return
    }

    const post = await createReply(postId, reply, ctx.user.id)

    await render(ctx, thread)
    
    ctx.redirect(ctx.originalUrl)

    await broadcast('reply', post)

}


module.exports = {
    getSingleThread,
    postSingleThread,
}
