import express from "express";
import bodyparser from "body-parser";
const { json, urlencoded } = bodyparser;
import cors from "cors";
import userRouter from "./router/userRouter.js";
import healthRouter from "./router/healthRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/v1/user", userRouter);
app.use("/", healthRouter);

export default app;
