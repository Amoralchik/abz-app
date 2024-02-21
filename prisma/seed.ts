import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import tinify from 'tinify';
const prisma = new PrismaClient();

async function main() {
  const positions = [
    { name: 'Security' },
    { name: 'Designer' },
    { name: 'Content manager' },
    { name: 'Lawyer' },
  ];

  for (const position of positions) {
    await prisma.position.create({
      data: position,
    });
  }

  tinify.key = process.env.TINIFY_API_KEY;

  for (let index = 1; index < 45; index++) {
    const source = tinify.fromUrl(faker.image.avatar());
    const resized = source.resize({
      method: 'cover',
      width: 70,
      height: 70,
    });
    await resized.toFile(`public/users/seedUser-${index}.png`);

    faker.image.avatar();
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: `+380${faker.string.numeric(9)}`,
        photo: `public/users/seedUser-${index}.png`,
        position: {
          connect: { id: faker.number.int({ min: 1, max: 4 }) },
        },
        registrationTimestamp: faker.date.betweens({
          from: '2024-01-01T00:00:00.000Z',
          to: '2024-02-20T00:00:00.000Z',
        })[0],
      },
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
