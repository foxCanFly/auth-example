const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');

const setUpAuthSettings = require('./auth');
const createDataStore = require('./dataStore/createDataStore');
const log = require('./log');


module.exports = async function app(config) {
  const app = new Koa();
  const port = process.env.PORT || 8080;

  app.name = 'auth-example';
  app.keys = config.secrets;

  try {
    app.context.dataStore = await createDataStore(config.dataStore);

    setUpAuthSettings(app);

    app.use(bodyParser());
    app.use(session({
      store: new MongoStore({ url: config.dataStore.mongo.uri })
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    const rootRouter = new Router();
    rootRouter.use('/api', apiRouter().routes(), apiRouter().allowedMethods());

    app.use(rootRouter.routes());

    app.on('error', (error, context) => {
      log.error(`Error processing ${context.method} ${context.url}: `, error);
    });

    app.listen(port);

    log.info(`App is started up successfully on port: ${port}`);
  } catch (error) {
    log.error('App is started up with error: ', error);
  }
};

function apiRouter() {
  const router = new Router();

  router.get('/me', async (context, next) => {
    context.body = { user: context.req.user };
  });

  router.get('/logout', async (context, next) => {
    await context.logout();
    context.body = { success: true };
  });

  router.post('/login', async (context, next) => {
    await passport.authenticate('local', async (err, user, info, status) => {
      if (!user) {
        context.body = { success: false };
        context.throw(401)
      } else {
        context.body = { success: true };
        await context.login(user)
      }
    })(context, next);
  });

  router.post('/join', async (context) => {
    const user = await context.dataStore.User.create(context.request.body);

    context.login(user);
    context.body = user;
  });

  return router;
}
