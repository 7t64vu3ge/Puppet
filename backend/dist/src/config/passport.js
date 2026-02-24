import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (_a, _r, profile, done) => {
    // TODO: find or create user in DB
    const user = {
        googleId: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        avatar: profile.photos?.[0]?.value,
    };
    done(null, user);
}));
export default passport;
