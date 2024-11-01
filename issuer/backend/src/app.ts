import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import visitorsRoutes from "./routes/visitors";
import locationsRoutes from "./routes/locations";
import usersRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import uuidRoutes from "./generateUUID";
//import didRoutes from "./routes/did"; // Import your DID routes
import morgan from "morgan"; // logs HTTP requests and errors
import createHttpError, { isHttpError } from "http-errors";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import CORS middleware
import session from "express-session";
//import env from "./util/validateEnv";
//import MongoStore from "connect-mongo";
import { auth } from "express-openid-connect";
import { sessionConfig } from "./config/sessionConfig";
import { oidcConfig } from "./config/oidcConfig";

// Initialize the Express app
const app = express();

app.set('trust proxy', true);


//===========================Here are the config stuff below this========================
// Define the allowed origin for CORS
const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || 'http://localhost:3000';

// Use CORS middleware to handle cross-origin requests
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

// Set up session management with MongoDB session store
app.use(session(sessionConfig));

// Use OpenID Connect middleware for authentication
app.use(auth(oidcConfig));
//===========================Here are the config stuff above this================================


// Initialize morgan for logging HTTP requests
app.use(morgan("dev"));

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Use environment variables for API paths
const VISITORS_API_PATH = process.env.VISITORS_API_PATH || "/api/visitors";
const LOCATIONS_API_PATH = process.env.LOCATIONS_API_PATH || "/api/locations";
const USERS_API_PATH = process.env.USERS_API_PATH || "/api/users";
const AUTH_API_PATH = process.env.AUTH_API_PATH || "/api";
//const DID_API_PATH = "/api/did";
const UUID_API_PATH = process.env.UUID_API_PATH || "/api/uuid";


// Mount API routes
app.use(VISITORS_API_PATH, visitorsRoutes);
app.use(LOCATIONS_API_PATH, locationsRoutes);
app.use(USERS_API_PATH, usersRoutes);
app.use(AUTH_API_PATH, authRoutes);
//app.use(DID_API_PATH, didRoutes);
app.use(UUID_API_PATH, uuidRoutes);


//========================ERROR HANDLERS===========================
// 404 error handling (Middleware for unknown routes)
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, "Endpoint not found")); // Pass error to the next middleware
});

app.use((error: unknown, req: Request, res: Response) => {
    //console.error(error);  // Log the error for debugging
    let errorMessage = "An unknown error occurred"; // Default error message
    let statusCode = 500; // Default status code for internal server error
    if (isHttpError(error)) {
        // If the error is an HTTP error, set the correct status and message
        statusCode = error.status;
        errorMessage = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message;
    }
    // Send the error response to the client
    res.status(statusCode).json({ error: errorMessage });
});
//========================ERROR HANDLERS===========================

export default app;
