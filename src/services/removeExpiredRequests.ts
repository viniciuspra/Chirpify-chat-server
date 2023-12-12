import cron from "node-cron";
import { prisma } from "../lib/prisma";

export const expiredRequest = cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      await prisma.request.deleteMany({
        where: {
          expiresAt: { lt: new Date() },
          NOT: {
            status: "pending",
          },
        },
      });
      console.log("Expired requests removed.");
    } catch (error) {
      console.error("Error removing expired requests:", error);
    }
  },
  {
    scheduled: true,
    timezone: "America/Sao_Paulo",
  }
);
