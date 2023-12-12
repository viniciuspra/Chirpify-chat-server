import socketio from "socket.io";
import http from "http";
import {
  searchFilteredUsers,
  getUser,
  searchUserContacts,
} from "./services/search";
import {
  RequestStatus,
  getReceivedFriendRequest,
  getSentFriendRequest,
  respondFriendRequest,
  sendFriendRequest,
} from "./services/request";

export function initializeSocket(server: http.Server): void {
  const io = new socketio.Server(server, {
    cors: { origin: "http://localhost:5173" },
  });

  io.on("connection", async (socket) => {
    console.log("User connected", socket.id);

    socket.on("searchUser", async (searchTerm: string, userId: string) => {
      try {
        const result = await searchFilteredUsers(searchTerm, userId);
        
        socket.emit("searchUser", result);
      } catch (error) {
        console.log("Error during search", error);
      }
    });

    socket.on(
      "searchUserContacts",
      async (searchTerm: string, userId: string) => {
        try {
          const result = await searchUserContacts(searchTerm, userId);

          socket.emit("searchUserContacts", result);
        } catch (error) {
          console.log("Error during search", error);
        }
      }
    );

    socket.on("getUser", async (username: string) => {
      try {
        const result = await getUser(username);

        if (result) {
          socket.emit("getUser", result);
        } else {
          socket.emit("getUser", null);
        }
      } catch (error) {
        console.log("Failed to retrieve user information.", error);
      }
    });

    socket.on("sendRequest", async (senderId: string, receiverId: string) => {
      try {
        const response = await sendFriendRequest(senderId, receiverId);

        return response.id;
      } catch (error) {
        console.log("Error sending friend request: ", error);
      }
    });

    socket.on("getReceivedFriendRequest", async (userId: string) => {
      try {
        const sender = await getReceivedFriendRequest(userId);

        socket.emit("getReceivedFriendRequest", sender);
      } catch (error) {
        console.log("Error sending friend request: ", error);
      }
    });

    socket.on("getSentFriendRequest", async (userId: string) => {
      try {
        const sender = await getSentFriendRequest(userId);

        socket.emit("getSentFriendRequest", sender);
      } catch (error) {
        console.log("Error sending friend request: ", error);
      }
    });

    socket.on(
      "respondFriendRequest",
      async (userId: string, senderId: string, status: RequestStatus) => {
        try {
          await respondFriendRequest(userId, senderId, status);
        } catch (error) {
          console.log("Error respond friend requests: ", error);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
}
