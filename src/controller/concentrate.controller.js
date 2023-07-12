const { getConcentrateCount, incrementConcentrateCount } = require("../model/concentrate.model")
const { broadcast } = require("../service/websocket.service")

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
async function apiPostConcentrate(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.response.status = 403
        ctx.body = { message: 'unauthorized' }
        return
    }

    const newCount = await incrementConcentrateCount()
    broadcast('concentrate', newCount)

    ctx.body = { count: newCount }
}

async function apiGetConcentrateCount(ctx) {
    if (!ctx.isLoggedIn) {
        ctx.response.status = 403
        ctx.body = { message: 'unauthorized' }
        return
    }

    const currentCount = await getConcentrateCount()


    ctx.body = {count: currentCount}
    return 
}

module.exports = {
    getConcentrate,
    apiPostConcentrate,
}
