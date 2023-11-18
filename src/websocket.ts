import { io } from "./http";

io.on("connection", (socket) => {
  console.log("User Connected -", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("disconnected", socket.id);
  });
});
