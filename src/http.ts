import express from "express";
import http from "http";
import cors from "cors";
import socketio from "socket.io";
import "express-async-errors";

import { errorHandler } from "./middlewares/errors";
import { routes } from "./routes";

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errorHandler);

const io = new socketio.Server(httpServer, {
  cors: {
    origin: "https://localhost:5173",
  },
});

export { httpServer, io };
