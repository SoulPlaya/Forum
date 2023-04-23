const Koa = require('koa')
const Router = require('@koa/router');
const session = require('koa-session');
const { koaBody } = require('koa-body');

const app = new Koa()
const router = new Router();

// Set up session (don't worry about it bro)
app.keys = ['secretKeyUsedToProtectUsDontShareOrDie']

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

// Read about Koa and web frameworks in general

// Middleware package for serving static files (like JS, CSS, images, etc)
// https://github.com/koajs/static

// Middleware package for using EJS templates
// https://github.com/koajs/ejs
// EJS reference: https://ejs.co/

// Example EJS: <p>Welcome back, <%= username %></p>
// Will be translated by the server into (and served as): <p>Welcome, back, soul</p> (assuming username variable provided by the server is "soul")

// Logger middleware
router.use(async (ctx, next) => {
    console.log(`${ctx.method} ${ctx.path}`)
    await next()
})

router.get('/', async (ctx, next) => {
    const name = ctx.query.name || 'Anonymous'

    ctx.body = `
        <form action="" method="POST">
            <label for="username">Username: </label>
            <input id="username" name="username" type="text" />

            <br><br>

            <label for="password">Password: </label>
            <input id="password" name="password" type="password" />

            <br><br>

            <input type="submit" value="Log In" />
        </form>
    `
})

router.post('/', async (ctx, next) => {
    const username = ctx.request.body.username
    const password = ctx.request.body.password

    if (password === 'IceCold') {
        ctx.session.username = username
        ctx.session.loggedIn = true
        ctx.redirect('/home')
    } else {
        ctx.body = 'Ur GAY'
    }
})

router.get('/home', async (ctx, next) => {
    if (ctx.session.loggedIn) {
        ctx.body = `Welcome home ${ctx.session.username}`
    } else {
        ctx.redirect('/')
    }
})

router.get('/logout', async (ctx, next) => {
    ctx.session.loggedIn = false
    ctx.redirect('/')
})

app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(3000, '0.0.0.0')
