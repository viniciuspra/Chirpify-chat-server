import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

async function SendMessage(message: string, userId: string, chatId: string) {
  try {
    await prisma.message.create({
      data: {
        chatId,
        userId,
        content: message,
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw new AppError("Error sending message", 500);
  }
}

async function getOrCreateChatId(
  userId: string,
  receiverId: string | undefined
) {
  const existingChat = await prisma.chat.findFirst({
    where: {
      AND: [
        { users: { some: { id: userId } } },
        { users: { some: { id: receiverId } } },
        { isGroupChat: false },
      ],
    },
  });

  if (existingChat) {
    return existingChat.id;
  } else {
    const newChat = await prisma.chat.create({
      data: {
        isGroupChat: false,
        users: {
          connect: [{ id: userId }, { id: receiverId }],
        },
      },
    });

    return newChat.id;
  }
}

async function getUserChats(userId: string) {
  try {
    const userChats = await prisma.chat.findMany({
      where: {
        users: { some: { id: userId } },
      },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        users: true,
      },
    });

    const userChatsWithLastMessage = userChats.map((chat) => {
      const isGroup = chat.isGroupChat;
      const otherUser = isGroup
        ? null
        : chat.users.find((user) => user.id !== userId);

      return {
        id: chat.id,
        name: isGroup ? chat.name : otherUser?.username || null,
        image: isGroup ? chat.image : otherUser?.avatar || null,
        lastMessage: chat.messages[0],
        isGroup,
        users: isGroup ? chat.users : [otherUser].filter(Boolean),
      };
    });

    const sortedChats = userChatsWithLastMessage.sort((a, b) => {
      if (!a.lastMessage || !b.lastMessage) return 0; // Handle cases where there's no last message
      return (
        b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
      );
    });

    return sortedChats;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw new AppError("Error fetching user chats", 500);
  }
}

async function getMessages(chatId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
    });

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new AppError("Error fetching messages", 500);
  }
}

export { SendMessage, getOrCreateChatId, getMessages, getUserChats };
