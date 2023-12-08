import { prisma } from "../lib/prisma";

async function searchUsers(search: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { fullname: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
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
    return [];
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
    return [];
  }
}

export { searchUsers, getUser };
