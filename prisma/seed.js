const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // ล้างข้อมูลก่อน seed
  await prisma.favorite.deleteMany();
  await prisma.finish.deleteMany();
  await prisma.news.deleteMany();
  await prisma.anime.deleteMany();
  await prisma.manga.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  // สร้างผู้ใช้
  const password = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: password,
      email: 'admin@example.com',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      username: 'user1',
      password: password,
      email: 'user1@example.com',
      role: 'USER',
    },
  });

  const publicUser = await prisma.user.create({
    data: {
      username: 'public_user',
      password: password,
      email: 'public@example.com',
      role: 'PUBLIC',
    },
  });

  // สร้าง Genre
  const genreAction = await prisma.genre.create({
    data: { name: 'Action' }
  });

  const genreFantasy = await prisma.genre.create({
    data: { name: 'Fantasy' }
  });

  // สร้าง Anime
  const anime1 = await prisma.anime.create({
    data: {
      title: 'Attack on Titan',
      genre: 'Action',
      author: 'Hajime Isayama',
      description: 'Titans attack the world.',
      createAt: new Date(),
      updateAt: new Date(),
      image: 'https://example.com/aot.jpg',
      genreId: genreAction.id,
    },
  });

  const anime2 = await prisma.anime.create({
    data: {
      title: 'Demon Slayer',
      genre: 'Fantasy',
      author: 'Koyoharu Gotouge',
      description: 'Demon-hunting siblings.',
      createAt: new Date(),
      updateAt: new Date(),
      image: 'https://example.com/demonslayer.jpg',
      genreId: genreFantasy.id,
    },
  });

  // สร้าง Manga
  const manga1 = await prisma.manga.create({
    data: {
      title: 'One Piece',
      genre: 'Adventure',
      author: 'Eiichiro Oda',
      description: 'Pirate journey.',
      createAt: new Date(),
      updateAt: new Date(),
      image: 'https://example.com/onepiece.jpg',
      genreId: genreAction.id,
    },
  });

  const manga2 = await prisma.manga.create({
    data: {
      title: 'Jujutsu Kaisen',
      genre: 'Action',
      author: 'Gege Akutami',
      description: 'Fighting cursed spirits.',
      createAt: new Date(),
      updateAt: new Date(),
      image: 'https://example.com/jujutsukaisen.jpg',
      genreId: genreFantasy.id,
    },
  });

  // สร้าง Favorite
  await prisma.favorite.create({
    data: {
      userId: user.id,
      animeId: anime1.id
    }
  });

  await prisma.favorite.create({
    data: {
      userId: user.id,
      mangaId: manga1.id
    }
  });

  // สร้าง Finish
  await prisma.finish.create({
    data: {
      userId: user.id,
      animeId: anime2.id
    }
  });

  await prisma.finish.create({
    data: {
      userId: user.id,
      mangaId: manga2.id
    }
  });

  // สร้างข่าวสาร
  await prisma.news.createMany({
    data: [
      {
        title: 'ข่าวใหม่ One Piece',
        content: 'One Piece ประกาศตอนใหม่ล่าสุด!',
        createAt: new Date(),
        updateAt: new Date()
      },
      {
        title: 'Attack on Titan ตอนสุดท้าย',
        content: 'ตอนสุดท้ายที่ทุกคนรอคอยกำลังมา!',
        createAt: new Date(),
        updateAt: new Date()
      }
    ]
  });

  console.log('✅ Seed ข้อมูลสำเร็จ!');
}

main()
  .catch((err) => {
    console.error('❌ Seed ล้มเหลว:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

