import passport from "passport";
import { Strategy as OpenIDConnectStrategy, VerifyCallback } from "passport-openidconnect";
import UserModel from "../models/user";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import connectMongo from "connect-mongo";
import dotenv from 'dotenv';
dotenv.config();

// Environment variable validation
const issuerBaseUrl = process.env.ISSUER_BASE_URL;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

if (!issuerBaseUrl || !clientID || !clientSecret) {
    throw new Error("Missing required environment variables for OpenID Connect.");
}

// Interface to describe the user profile
interface IUserInfo {
    email: string;
    firstName: string;
    lastName: string;
}

// OpenID Connect Strategy
passport.use(new OpenIDConnectStrategy({
    issuer: issuerBaseUrl,
    clientID: clientID,
    clientSecret: clientSecret,
    authorizationURL: `${issuerBaseUrl}/application/o/authorize/`,
    tokenURL: `${issuerBaseUrl}/application/o/token/`,
    userInfoURL: `${issuerBaseUrl}/application/o/userinfo/`,
    callbackURL: `${process.env.CORS_ALLOWED_ORIGIN}/auth/callback`,
    passReqToCallback: true,
}, async (_issuer: string, profile: unknown, done: VerifyCallback) => {
    try {
        const userProfile = profile as IUserInfo;  

        let user = await UserModel.findOne({ email: userProfile.email }).exec();
        if (!user) {
            user = await UserModel.create({
                name: `${userProfile.firstName} ${userProfile.lastName}`,
                email: userProfile.email,
            });
        }
        done(null, user);
    } catch (error) {
        console.error("Authentication error:", error);
        //done(error); // Pass the error to `done`
    }
}));

// Type definition for User
type User = {
    _id?: number;
};

// Serialize user to session
passport.serializeUser((user: User, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await UserModel.findById(id).exec();
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

// Setup session management
export const setupSession = (app: express.Application) => {
    app.use(session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: true,
        store: connectMongo.create({
            mongoUrl: process.env.MONGO_CONNECTION_STRING,  // Use the MongoDB connection string
            collectionName: 'sessions',
            ttl: 24 * 60 * 60,  // 24 hours
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'none',
            domain: 'localhost'
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};


// Authentication routes
// export const authRoutes = (app: express.Application) => {
//     app.get("/auth/login", passport.authenticate("openidconnect"));
    
//     app.get("/auth/callback", passport.authenticate("openidconnect", {
//         failureRedirect: "/auth/login",
//         successRedirect: "/dashboard",
//     }));

//     app.get("/auth/logout", (req: Request, res: Response) => {
//         req.logout((err) => {
//             if (err) {
//                 return res.redirect("/error");
//             }
//             req.session.destroy(() => {
//                 res.redirect("/");  // Redirect after session destruction
//             });
//         });
//     });
// };

// Middleware to require authentication
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
};
