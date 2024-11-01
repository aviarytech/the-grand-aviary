import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

//port initialization from external private file
const port = env.PORT;

//server and database
mongoose.connect(env.MONGO_CONNECTION_STRING!)
    .then(() => {
        console.log("Mongoose connected");
        //start server
        app.listen(port, () => {
            console.log("Server running on port: " + port);
        });
    })
    //print to error console (red text)
    .catch(console.error);

