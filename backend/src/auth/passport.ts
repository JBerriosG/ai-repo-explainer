import 'dotenv/config';
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import prisma from "../lib/prisma.js";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  done(null, user);
});
console.log("Initializing GitHub Strategy with client ID:", process.env.GITHUB_CLIENT_ID);
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: "http://localhost:5000/auth/github/callback"
  },
  async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {

    let user = await prisma.user.findUnique({
      where: {
        githubId: profile.id
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: profile.id,
          username: profile.username || "",
          email: profile.emails?.[0]?.value,
          avatarUrl: profile.photos?.[0]?.value,
          accessToken: _accessToken
        }
      });
    } else {

      user = await prisma.user.update({
        where: {
          githubId: profile.id
        },
        data: {
          accessToken: _accessToken
        }
      });
    }

    return done(null, user);
  }
));