import { response, request } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export type RequestStatus = "accepted" | "rejected" | "pending";

async function sendFriendRequest(senderId: string, receiverId: string) {
  try {
    const friendRequest = await prisma.request.create({
      data: {
        senderId,
        receiverId,
        status: "pending",
        expiresAt: new Date(Date.now() + 10000),
      },
    });
    return friendRequest;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw new AppError("Error sending friend request.");
  }
}

async function getReceivedFriendRequest(userId: string) {
  try {
    const friendRequests = await prisma.request.findMany({
      where: { receiverId: userId, status: "pending" },
      include: { sender: true },
    });

    const senders = friendRequests.map(({ sender }) => sender);

    return senders;
  } catch (error) {
    console.error("Error getting received friend requests:", error);
    throw new AppError("Error getting received friend requests.");
  }
}

async function getSentFriendRequest(userId: string) {
  try {
    const friendRequests = await prisma.request.findMany({
      where: { senderId: userId, status: "pending" },
      include: { receiver: true },
    });

    const receivers = friendRequests.map(({ receiver }) => receiver);

    return receivers;
  } catch (error) {
    console.error("Error getting sent friend requests:", error);
    throw new AppError("Error getting sent friend requests.");
  }
}

async function respondFriendRequest(
  userId: string,
  senderId: string,
  status: RequestStatus
) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        receivedRequests: {
          where: {
            senderId,
            status: "pending",
          },
        },
      },
    });

    if (!user || !user.receivedRequests || user.receivedRequests.length === 0) {
      throw new AppError("Friend request not found.", 404);
    }

    const receivedRequest = user.receivedRequests[0];

    await prisma.request.update({
      where: { id: receivedRequest.id, senderId },
      data: { status },
    });

    if (status === "rejected") {
      await prisma.request.delete({
        where: { id: receivedRequest.id },
      });
    }

    if (status === "accepted") {
      await prisma.contact.create({
        data: {
          contactId: senderId,
          userId,
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Error respond friend requests:", error);
    throw new AppError("Error respond friend requests.");
  }
}

export {
  sendFriendRequest,
  getReceivedFriendRequest,
  getSentFriendRequest,
  respondFriendRequest,
};
