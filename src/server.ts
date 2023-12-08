import express from "express";
import { createServer } from "http";
import cors from "cors";
import "express-async-errors";

import { errorHandler } from "./middlewares/errors";
import { routes } from "./routes";

import { initializeSocket } from "./socket";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

initializeSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
