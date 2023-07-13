const config = require('../config.json')

const Koa = require('koa')
const http = require('node:http')
const Router = require('@koa/router')
const session = require('koa-session')
const render = require('@koa/ejs')
const path = require('node:path')
const koaStatic = require('koa-static')
const koaMount = require('koa-mount')
const { koaBody } = require('koa-body')

const dbUtil = require('./util/db.util')

// Services
const websocketService = require('./service/websocket.service')

const { createConcentrateRowOrIgnore } = require('./model/concentrate.model')

// Load middleware modules
const loggerMiddleware = require('./middleware/logger.middleware')
const authMiddleware = require('./middleware/auth.middleware')
const utilMiddleware = require('./middleware/utils.middleware')

// Load controller modules
const registerController = require('./controller/register.controller')
const homeController = require('./controller/home.controller')
const loginController = require('./controller/login.controller')
const profileEditorController = require('./controller/profileeditor.controller')
const myProfileController = require('./controller/myprofile.controller')
const singleThreadController = require('./controller/singleThread.controller')
const utilsMiddleware = require('./middleware/utils.middleware')
const UserProfileController  = require('./controller/UserProfile.controller')
const createThreadController = require('./controller/createthread.controller')
const concentrateController = require('./controller/concentrate.controller')
const threadListingController = require('./controller/threadListing.controller')


const PROJECT_ROOT = path.join(__dirname, '..')

async function main() {
    await dbUtil.initDb()
    await createConcentrateRowOrIgnore()

    // Create Koa application and its router
    const app = new Koa()
    const appHttp = http.createServer(app.callback())
    const router = new Router()

    // Initialize services
    await websocketService.init(appHttp)

    // Mount static files located in the "static" directory at /static on the webserver
    app.use(koaMount('/static', koaStatic(path.join(PROJECT_ROOT, 'static'))))

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
    router.use(utilsMiddleware)

    // Register controller routes
    router.get('/', homeController.getHome)

    router.get('/login', loginController.getLogin)
    router.post('/login', loginController.postLogin)
    router.get('/logout', loginController.getLogout)

    router.get('/profileEditor', profileEditorController.getProfileEditor)
    router.post('/profileEditor', profileEditorController.postProfileEditor)

    router.get('/my-profile', myProfileController.getMyProfile)

    router.get('/register', registerController.getRegister)
    router.post('/register', registerController.postRegister)

    router.get('/UserProfile', UserProfileController.getUserProfile)

    router.get('/createthread', createThreadController.getCreateThread )
    router.post('/createthread', createThreadController.postCreateThread)

    router.get('/thread/:id', singleThreadController.getSingleThread)
    router.post('/thread/:id', singleThreadController.postSingleThread)

    router.get('/concentrate', concentrateController.getConcentrate)
    router.post('/api/concentrate', concentrateController.apiPostConcentrate)

    router.get('/threads', threadListingController.getThreadListing)

    // Finish setting up the application server
    app
        .use(router.routes())
        .use(router.allowedMethods())

    appHttp.listen(
        config.server.port,
        config.server.host,
        () => console.log(`Listening on ${config.server.host}:${config.server.port}`)
    )
}

main()
