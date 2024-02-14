import socketio from "socket.io";
import http from "http";
import { Socket } from "socket.io";

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

import {
  SendMessage,
  getMessages,
  getOrCreateChatId,
  getUserChats,
} from "./services/message";

export function initializeSocket(server: http.Server): void {
  const io = new socketio.Server(server, {
    cors: { origin: "https://chirpify.netlify.app" },
  });

  io.on("connection", handleConnection);
}

function handleConnection(socket: Socket) {
  console.log("User connected", socket.id);

  socket.on("searchUser", (searchTerm: string, userId: string) =>
    handleEvent(socket, "searchUser", () =>
      searchFilteredUsers(searchTerm, userId)
    )
  );

  socket.on("searchUserContacts", (searchTerm: string, userId: string) =>
    handleEvent(socket, "searchUserContacts", () =>
      searchUserContacts(searchTerm, userId)
    )
  );

  socket.on("getUser", (username: string) =>
    handleEvent(socket, "getUser", () => getUser(username))
  );

  socket.on("sendRequest", (senderId: string, receiverId: string) =>
    handleEvent(socket, "sendRequest", () =>
      sendFriendRequest(senderId, receiverId)
    )
  );

  socket.on("getReceivedFriendRequest", (userId: string) =>
    handleEvent(socket, "getReceivedFriendRequest", () =>
      getReceivedFriendRequest(userId)
    )
  );

  socket.on("getSentFriendRequest", (userId: string) =>
    handleEvent(socket, "getSentFriendRequest", () =>
      getSentFriendRequest(userId)
    )
  );

  socket.on(
    "respondFriendRequest",
    (userId: string, senderId: string, status: RequestStatus) =>
      handleEvent(socket, "respondFriendRequest", () =>
        respondFriendRequest(userId, senderId, status)
      )
  );

  socket.on("message", (message: string, userId: string, receiverId: string) =>
    handleEvent(socket, "message", () =>
      SendMessage(message, userId, receiverId)
    )
  );

  socket.on("getChatId", (userId: string, receiverId: string) =>
    handleEvent(socket, "getChatId", () =>
      getOrCreateChatId(userId, receiverId)
    )
  );

  socket.on("getUserChats", (userId: string) =>
    handleEvent(socket, "getUserChats", () => getUserChats(userId))
  );

  socket.on("getMessages", (chatId: string) =>
    handleEvent(socket, "getMessages", () => getMessages(chatId))
  );

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
}

async function handleEvent(
  socket: Socket,
  eventName: string,
  eventHandler: () => Promise<any>
) {
  try {
    const result = await eventHandler();
    socket.emit(eventName, result);
  } catch (error) {
    console.error(`Error handling ${eventName}:`, error);
  }
}
