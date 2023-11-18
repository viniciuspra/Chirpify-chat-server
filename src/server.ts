import { httpServer } from "./http";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
