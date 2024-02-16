import express from "express";
import http from "http";
import cors from "cors";
import "express-async-errors";

import dotenv from "dotenv";
dotenv.config();

import { UPLOAD_FOLDER } from "./configs/upload";

import { initializeSocket } from "./websocket";
import { expiredRequest } from "./services/removeExpiredRequests";
import { errorHandler } from "./middlewares/errors";
import { routes } from "./routes";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/files", express.static(UPLOAD_FOLDER));
app.use("/api", routes);
app.use(errorHandler);

initializeSocket(server);
expiredRequest.start();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
