import express from "express";
import "express-async-errors";
import { configDotenv } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDb from "./db/connect.js";
import errorHandler from "./middlewares/error-handler.js";
import authHandler from "./middlewares/auth-handler.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth-router.js";
import projectRouter from "./routes/project-router.js";
import usersRouter from "./routes/users-router.js";
import tasksRouter from "./routes/tasks-router.js";
import notifyRouter from "./routes/notification-router.js";
configDotenv();

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);

app.use((req, res, next) => {
  console.log("REQUEST BODY", req.body);
  req.port = port;
  next();
});

app.use("/api/auth", authRouter);

app.use(authHandler);

app.use("/api/users", usersRouter);

app.use("/api/projects", projectRouter);

app.use("/api/tasks", tasksRouter);

app.use("/api/notifications", notifyRouter);

// Handle Invalid routes
app.use((req, res) => {
  res.status(404).json({
    message: `${req.protocol}://${
      req.hostname + req.url
    } is not a valid route :( `,
  });
});

app.use(errorHandler);

const start = async () => {
  try {
    await connectDb(process.env.MONGO_STRING);
    console.log("Database connected!");
    app.listen(port, () =>
      console.log(`Server is live and running on port ${port}`)
    );
  } catch (error) {
    console.error(error.stack);
  }
};
start();
