import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

async function sendFriendRequest(senderId: string, receiverId: string) {
  try {
    const request = await prisma.request.create({
      data: {
        senderId,
        receiverId,
        status: "pending",
      },
    });
    return request;
  } catch (error) {
    console.error(error);
    throw new AppError("Error sending friend request.");
  }
}

async function getReceivedFriendRequest(userId: string) {
  try {
    const request = await prisma.request.findMany({
      where: { receiverId: userId, status: "pending" },
      include: { sender: true },
    });

    const sender = request.map((request) => request.sender);
    
    return sender;
  } catch (error) {
    console.error(error);
    throw new AppError("Error getting received friend requests.");
  }
}

async function acceptedFriendRequest(requestId: string) {
  try {
  } catch (error) {
    console.error(error);
    throw new AppError("Error accepted friend requests.");
  }
}

export { sendFriendRequest, getReceivedFriendRequest };
