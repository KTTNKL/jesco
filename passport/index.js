const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const userService = require('../components/auth/userService');

passport.use(new LocalStrategy(
    async function (username, password, done) {
        const user = await userService.findByUsername(username);
        if (!user)
            return done(null, false, { message: "Incorrect username." });
        const isValid = await userService.validPassword(password, user);
        if (!isValid) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);     
    },
));

passport.serializeUser(function(user, done) {
    done(null,{username: user.username, email: user.email_address}  );
  });
  
passport.deserializeUser(function(username, done) {
    done(null, user);
});

module.exports = passport;