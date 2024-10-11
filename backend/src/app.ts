import "dotenv/config";
import express, { Request, Response, /*NextFunction*/ } from "express";
import visitorsRoutes from "./routes/visitors";
import locationsRoutes from "./routes/locations";
import usersRoutes from "./routes/users";
import morgan from "morgan"; // logs HTTP requests and errors
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors"; // Import CORS middleware
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";

// This is our server
const app = express();

const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Initialize morgan for logging HTTP requests
app.use(morgan("dev"));

// Middleware to parse JSON bodies
app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60*60 *1000
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
}));

// Use environment variables for API paths
const VISITORS_API_PATH = process.env.VISITORS_API_PATH || "/api/visitors"; // Default path
const LOCATIONS_API_PATH = process.env.LOCATIONS_API_PATH || "/api/locations"; // Default path
const USERS_API_PATH = process.env.USERS_API_PATH || "/api/users"; // Default path
// Mount routes
app.use(VISITORS_API_PATH, visitorsRoutes);
app.use(LOCATIONS_API_PATH, locationsRoutes);
app.use(USERS_API_PATH, usersRoutes);

// Error message middleware for handling 404 errors
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found")); // Ensure next() is called
});

// ERROR HANDLER MIDDLEWARE
app.use((error: unknown, req: Request, res: Response) => { // Removed 'next'
    console.error(error);
    let errorMessage = "An unknown error occurred"; // Generic error message
    let statusCode = 500; // Default error code

    if (isHttpError(error)) { // Check for specific HTTP errors
        statusCode = error.status;
        errorMessage = error.message;
    }

    res.status(statusCode).json({ error: errorMessage }); // Send the error response
});

// Export the app for use in other modules
export default app;