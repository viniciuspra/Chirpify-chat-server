import { prisma } from "./../src/lib/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

async function main() {
  const usersData = Array.from({ length: 10 }).map(() => ({
    fullname: faker.person.fullName(),
    username: faker.internet.userName(),
    password: bcrypt.hashSync("123456", 10)
  }));

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { username: userData.username },
      update: {},
      create: userData,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
