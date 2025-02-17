import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/ErrorHandler";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(errorHandler);
export default app;
