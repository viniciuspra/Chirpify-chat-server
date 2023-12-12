import express from "express";
import { createServer } from "http";
import cors from "cors";
import "express-async-errors";

import { errorHandler } from "./middlewares/errors";
import { routes } from "./routes";

import { initializeSocket } from "./websocket";

import dotenv from "dotenv";
import { expiredRequest } from "./services/removeExpiredRequests";
dotenv.config();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

initializeSocket(server);
expiredRequest.start();

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
