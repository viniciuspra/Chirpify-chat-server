import { prisma } from "../lib/prisma";

interface StatusProps {
  userId: string;
  isOnline: boolean;
}

async function updateUserStatus({ userId, isOnline }: StatusProps) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isOnline },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
  }
}
