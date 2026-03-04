const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google profile received:', JSON.stringify(profile));
        const email = profile.emails[0].value;
        const avatar = profile.photos[0] ? profile.photos[0].value : '';
        const name = profile.displayName;

        console.log('Looking up user:', email);
        let user = await User.findOne({ email });
        console.log('User found:', user);

        if (!user) {
            const newUser = {
                name,
                email,
                avatar,
                password: null,
                googleAuth: true,
                isAdmin: false,
                createdAt: new Date().toISOString()
            };
            await User.create(newUser);
            user = await User.findOne({ email });
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
