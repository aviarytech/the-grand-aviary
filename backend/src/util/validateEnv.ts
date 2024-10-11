//This file is simply for validation of the MONGODB string and the back end port
import {cleanEnv} from "envalid";
import {port, str} from "envalid/dist/validators";

//exporting the return value of the cleanEnv funtion
export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str(),
});
