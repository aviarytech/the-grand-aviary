import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import notesRoutes from "./routes/notes";
import morgan from "morgan";//logs HTTP requests and errors
import createHttpError, { isHttpError } from "http-errors";

//this is our server
const app = express();
//initalize morgan
app.use(morgan("dev"));

app.use(express.json());

app.use("/api/notes", notesRoutes);

//error message middleware
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});


//ERROR HANDLER MIDDLEWARE
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unkown error ccurred";//generic error message
    let statusCode = 500;//error code if there is not more specific one
    if(isHttpError(error)){//check if there is a different more accurate error code/message
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({error:errorMessage});//send an error message
});

export default app;