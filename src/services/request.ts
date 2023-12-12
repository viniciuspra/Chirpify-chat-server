import { response, request } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export type RequestStatus = "accepted" | "rejected" | "pending";

async function sendFriendRequest(senderId: string, receiverId: string) {
  try {
    const request = await prisma.request.create({
      data: {
        senderId,
        receiverId,
        status: "pending",
        expiresAt: new Date(Date.now() + 10000),
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

async function getSentFriendRequest(userId: string) {
  try {
    const request = await prisma.request.findMany({
      where: { senderId: userId, status: "pending" },
      include: { receiver: true },
    });

    const receiver = request.map((request) => request.receiver);

    return receiver;
  } catch (error) {
    console.error(error);
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

    if (user.receivedRequests[0].id) {
      await prisma.request.update({
        where: { id: user.receivedRequests[0].id, senderId },
        data: { status },
      });

      if (status === "rejected") {
        await prisma.request.delete({
          where: { id: user.receivedRequests[0].id },
        });
      }
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
    console.error(error);
    throw new AppError("Error respond friend requests.");
  }
}

export {
  sendFriendRequest,
  getReceivedFriendRequest,
  getSentFriendRequest,
  respondFriendRequest,
};
