const { getConcentrateCount, incrementConcentrateCount } = require("../model/concentrate.model")

/**
 * @param {AppContext} ctx
 * @param {number} count
 */
async function render(ctx, count) {
    await ctx.defaultRender('concentrate', 'concentrate', null, { count })
}

/**
 * @param {AppContext} ctx
 */
async function getConcentrate(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/')
        return
    }

    const count = await getConcentrateCount()

    await render(ctx, count)
}

/**
 * @param {AppContext} ctx
 */
async function postConcentrate(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.redirect('/')
        return
    }

   const newCount = await incrementConcentrateCount()

   await render(ctx, newCount)

}

module.exports = {
    getConcentrate,
    postConcentrate,
}
