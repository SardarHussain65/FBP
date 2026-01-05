const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('./Models/Users');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(async (UserName, Password, done) => {
    try {

        const user = await User.findOne({ username: UserName });

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const isPasswordValid = await bcrypt.compare(Password, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: 'Incorrect password.' });
        } else {
            return done(null, user);
        }
    } catch (error) {
        return done(error);
    }
}))

module.exports = passport;