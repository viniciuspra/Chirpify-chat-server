import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

async function searchFilteredUsers(search: string, userId: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { username: { contains: search, mode: "insensitive" } },
                  { fullname: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          {
            NOT: {
              OR: [
                {
                  receivedRequests: {
                    some: { senderId: userId, status: "pending" },
                  },
                },
                {
                  sentRequests: {
                    some: { receiverId: userId, status: "pending" },
                  },
                },
                { contacts: { some: { contactId: userId } } },
                { contactsOf: { some: { userId } } },
              ],
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        isOnline: true,
        avatar: true,
      },
    });

    return users;
  } catch (error) {
    console.error("Error during user search: ", error);
    throw new AppError("Failed to search filtered users.");
  }
}

async function searchUserContacts(search: string, userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        contacts: {
          include: {
            contact: true,
          },
          where: {
            contact: {
              OR: [
                {
                  fullname: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  username: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
        contactsOf: {
          include: {
            user: true,
          },
          where: {
            user: {
              OR: [
                {
                  fullname: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  username: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
      },
    });

    if (!user) {
      console.error("User not found");
      return null;
    }

    const contacts = user.contacts.map((contactEntry) => contactEntry.contact);
    const contactsOf = user.contactsOf.map((contactEntry) => contactEntry.user);

    return [...contacts, ...contactsOf];
  } catch (error) {
    console.error("Error during user search: ", error);
    throw new AppError("Failed to search user contacts.");
  }
}

async function getUser(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to retrieve user information: ", error);
    throw new AppError("Failed to retrieve user information.");
  }
}

export { searchFilteredUsers, searchUserContacts, getUser };
