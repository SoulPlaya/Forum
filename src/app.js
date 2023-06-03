const config = require('../config.json')

const Koa = require('koa')
const Router = require('@koa/router')
const session = require('koa-session')
const render = require('@koa/ejs')
const path = require('node:path')
const koaStatic = require('koa-static')
const koaMount = require('koa-mount')
const { koaBody } = require('koa-body')

const dbUtil = require('./util/db.util')

// Load middleware modules
const loggerMiddleware = require('./middleware/logger.middleware')
const authMiddleware = require('./middleware/auth.middleware')

// Load controller modules
const homeController = require('./controller/home.controller')
const loginController = require('./controller/login.controller')
const profileEditorController = require('./controller/profileeditor.controller')
const myProfileController = require('./controller/myprofile.controller')
const postsController = require('./controller/posts.controller')

async function main() {
    await dbUtil.initDb()

    // Create Koa application and its router
    const app = new Koa()
    const router = new Router()

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

    // Register middleare
    router.use(loggerMiddleware)
    router.use(authMiddleware)

    // Register controller routes
    router.get('/', homeController.getHome)

    router.get('/login', loginController.getLogin)
    router.post('/login', loginController.postLogin)
    router.get('/logout', loginController.getLogout)

    router.get('/profile-editor', profileEditorController.getProfileEditor)
    router.post('/profile-editor', profileEditorController.postProfileEditor)

    router.get('/my-profile', myProfileController.getMyProfile)

    router.get('/posts', postsController.getPosts)

    // Finish setting up the application server
    app
        .use(router.routes())
        .use(router.allowedMethods())

    app.listen(
        config.server.port,
        config.server.host,
        () => console.log(`Listening on ${config.server.host}:${config.server.port}`)
    )
}

main()
