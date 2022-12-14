import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import LocalStrategy from "passport-local";
import {ENDPOINT, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NODE_ENV} from "./config";
import prisma from "./prisma";

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: ENDPOINT + "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function verify(accessToken, refreshToken, profile, cb) {
      console.log("Verifying user");

      const user =
        (await prisma.user
          .upsert({
            where: {
              googleId: profile.id,
            },
            update: {},
            create: {
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0].value || "",
            },
          })
          .catch((err) => err)) || false;

      console.log("User", user);

      return cb(null, user);
    }
  )
);

// Saved to cookie?
passport.serializeUser(async (googleUser: any, done) => {
  console.log("Serializing user");
  console.log(googleUser);
  done(null, googleUser?.googleId);
});

passport.deserializeUser(async (googleId: any, done) => {
  // const user = await prisma.user.findUnique({where: {
  //   googleId: user,
  //   }});
  console.log("Deserializing");
  const user =
    (await prisma.user
      .findUnique({ where: { googleId: googleId } })
      .catch(console.error)) || false;
  if (user) {
    console.log(user.accessLevel);
  }

  console.log(googleId, user);

  done(null, user);
});
