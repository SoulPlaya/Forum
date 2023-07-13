const { ThreadInfo, Post, getThreadById, getThreadCount, getThreads} = require("../model/posts.model")

/**
 * @param {AppContext} ctx
 * @param {ThreadInfo[]} threads
 */
async function render(ctx, threads) {
    await ctx.defaultRender('threadListing', 'thread list', null, {
        threads,
    })
}

/**
 * @param {AppContext} ctx
 */
async function getThreadListing(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/login')
        return
    }
    const amountOfThreads = await getThreadCount()

    const threadsPerPage = 10

    // TODO Use an offset based on page number
    const threads = await getThreads(0, threadsPerPage)

   await render(ctx, threads)
}


module.exports = {
    getThreadListing,
}