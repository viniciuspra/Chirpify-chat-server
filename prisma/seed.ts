import { prisma } from './../src/lib/prisma';
import { faker } from '@faker-js/faker';

async function main() {
  const usersData = Array.from({ length: 10 }).map(() => ({
    fullname: faker.person.fullName(),
    username: faker.internet.userName(),
    password: "123456",
    avatar: faker.image.avatar(),
  }))

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { username: userData.username},
      update: {},
      create: userData
    })
  }

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
