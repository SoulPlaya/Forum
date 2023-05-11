const config = require('./config.json')

const Koa = require('koa')
const Router = require('@koa/router')
const session = require('koa-session')
const render = require('@koa/ejs')
const path = require('node:path')
const koaStatic = require('koa-static')
const koaMount = require('koa-mount')
const { koaBody } = require('koa-body')

const app = new Koa()
const router = new Router();

// Mount static files located in the "static" directory at /static on the webserver
app.use(koaMount('/static', koaStatic(path.join(__dirname, 'static'))))

render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'layout',
    viewExt: 'ejs',
    cache: config.productionMode,
    debug: false,
    async: true,
})

// Set up session
app.keys = [config.sessionSecret]

const sessionConfig = {
  key: 'forum-session',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
  secure: false, // <-- This should be true in production
  sameSite: null,
}

router.use(koaBody())
router.use(session(sessionConfig, app))

// Create a My Profile page, storing the profile info in ctx.session
// When you first log in, set all of the profile values (name, age, bio) to null
// Redirect to login on the My Profile page if you're not signed in
// Create a Edit My Profile page that lets you set those values
//^button in /home that gets you to edit profile

// Logger middleware
router.use(async (ctx, next) => {
    console.log(`${ctx.method} ${ctx.path}`)
    await next()
})

router.get('/', async (ctx, next) => {
    const name = ctx.query.name || 'Anonymous'

    await ctx.render('login', { pageTitle: 'Log In', errorMessage: null })
})

router.post('/', async (ctx, next) => {
    const username = ctx.request.body.username
    const password = ctx.request.body.password

    if (password === 'IceCold') {
        ctx.session.username = username
        ctx.session.loggedIn = true
        ctx.redirect('/home')
    } else {
        await ctx.render('login', { pageTitle: 'Log In', errorMessage: 'Ur GAY' })
    }
})

router.get('/myProfile', async (ctx, next) => {
    if (!ctx.session.loggedIn) {
        ctx.redirect('/')
        return
    }
})

router.get('/home', async (ctx, next) => {
    if (!ctx.session.loggedIn) {
        ctx.redirect('/')
        return
    }

    await ctx.render('home', { pageTitle: 'Home', username: ctx.session.username })
})

router.get('/logout', async (ctx, next) => {
    ctx.session.loggedIn = false
    ctx.redirect('/')
})

app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(config.server.port, config.server.host)
