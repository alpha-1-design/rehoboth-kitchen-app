const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { usersDB } = require('../db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0].value;
        const name = profile.displayName;

        let user = await usersDB.findOne({ email });

        if (!user) {
            const newUser = {
                name,
                email,
                avatar,
                password: null,
                role: 'user',
                googleId: profile.id,
                createdAt: new Date().toISOString()
            };
            await usersDB.insert(newUser);
            user = await usersDB.findOne({ email });
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
