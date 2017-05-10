const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;


async function setUpAuthSettings(app) {
  const dataStore = app.context.dataStore;

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  });

  passport.deserializeUser(async function(id, done) {
    try {
      const user = await dataStore.User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    }
  });

  const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async function(email, password, done) {
    try {
      const user = await dataStore.User.findOne({ email });

      if (user && user.checkPassword(password)) {
        done(null, user);
      } else {
        done(null, null);
      }
    } catch(err) {
      done(err)
    }
  });

  passport.use(localStrategy);
}

module.exports = setUpAuthSettings;
