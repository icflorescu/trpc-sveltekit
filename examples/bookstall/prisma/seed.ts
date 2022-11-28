import { PrismaClient } from '@prisma/client';
import { md5 } from 'hash-wasm';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();

  await prisma.user.create({
    data: { name: 'John Doe', email: 'john@mail.com', passwordHash: await md5('1234') }
  });
  await prisma.user.create({
    data: { name: 'Jane Doe', email: 'jane@mail.com', passwordHash: await md5('qwer') }
  });

  await prisma.author.create({
    data: {
      firstName: 'Brandon',
      lastName: 'Sanderson',
      books: {
        create: [
          { title: 'The Way of Kings', price: 12.98 },
          { title: 'Words of Radiance', price: 11.49 },
          { title: 'Oathbringer', price: 14.98 },
          { title: 'Rhythm of War', price: 16.49 },
          { title: 'Elantris', price: 9.99 },
          { title: 'The Emperor’s Soul', price: 9.99 },
          { title: 'Warbreaker', price: 9.99 },
          { title: 'The Hero of Ages', price: 13.99 },
          { title: 'Mistborn', price: 11.99 },
          { title: 'The Alloy of Law', price: 9.99 },
          { title: 'The Well of Ascension', price: 9.99 }
        ]
      }
    }
  });

  await prisma.author.create({
    data: {
      firstName: 'Patrick',
      lastName: 'Rothfuss',
      books: {
        create: [
          { title: 'The Name of the Wind', price: 9.99 },
          { title: 'The Wise Man’s Fear', price: 9.99 }
        ]
      }
    }
  });

  await prisma.author.create({
    data: {
      firstName: 'George R. R.',
      lastName: 'Martin',
      books: {
        create: [
          { title: 'A Game of Thrones', price: 9.99 },
          { title: 'A Clash of Kings', price: 9.99 },
          { title: 'A Storm of Swords', price: 9.99 },
          { title: 'A Feast for Crows', price: 9.99 },
          { title: 'A Dance with Dragons', price: 9.99 }
        ]
      }
    }
  });

  await prisma.author.create({
    data: {
      firstName: 'J. R. R.',
      lastName: 'Tolkien',
      books: {
        create: [
          { title: 'The Fellowship of the Ring', price: 9.99 },
          { title: 'The Two Towers', price: 9.99 },
          { title: 'The Return of the King', price: 9.99 }
        ]
      }
    }
  });

  await prisma.author.create({
    data: {
      firstName: 'Robert',
      lastName: 'Jordan',
      books: {
        create: [
          { title: 'The Eye of the World', price: 9.99 },
          { title: 'The Great Hunt', price: 9.99 },
          { title: 'The Dragon Reborn', price: 9.99 },
          { title: 'The Shadow Rising', price: 9.99 },
          { title: 'The Fires of Heaven', price: 9.99 },
          { title: 'Lord of Chaos', price: 9.99 },
          { title: 'A Crown of Swords', price: 9.99 },
          { title: 'The Path of Daggers', price: 9.99 },
          { title: 'Winter’s Heart', price: 9.99 },
          { title: 'Crossroads of Twilight', price: 9.99 },
          { title: 'Knife of Dreams', price: 9.99 },
          { title: 'The Gathering Storm', price: 9.99 },
          { title: 'Towers of Midnight', price: 9.99 },
          { title: 'A Memory of Light', price: 9.99 }
        ]
      }
    }
  });

  const storeIds: string[] = [];

  await prisma.store
    .create({ data: { name: 'London' }, select: { id: true } })
    .then(({ id }) => storeIds.push(id));
  await prisma.store
    .create({ data: { name: 'New York' }, select: { id: true } })
    .then(({ id }) => storeIds.push(id));
  await prisma.store
    .create({ data: { name: 'Sydney' }, select: { id: true } })
    .then(({ id }) => storeIds.push(id));
  await prisma.store
    .create({ data: { name: 'Berlin' }, select: { id: true } })
    .then(({ id }) => storeIds.push(id));
  await prisma.store
    .create({ data: { name: 'Tokyo' }, select: { id: true } })
    .then(({ id }) => storeIds.push(id));
  await prisma.store
    .create({ data: { name: 'Paris' }, select: { id: true } })
    .then(({ id }) => storeIds.push(id));

  const bookIds = await prisma.book
    .findMany({ select: { id: true } })
    .then((books) => books.map(({ id }) => id));

  for (const bookId of bookIds) {
    const selectedStoreIds: string[] = [];
    for (let i = 0; i < 3; i++) {
      const randomStoreId = storeIds[Math.floor(Math.random() * storeIds.length)];
      if (!selectedStoreIds.includes(randomStoreId)) {
        selectedStoreIds.push(randomStoreId);
      }
    }
    await prisma.book.update({
      where: { id: bookId },
      data: {
        stores: {
          connect: selectedStoreIds.map((id) => ({ id }))
        }
      }
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
