import prisma from "../config/prisma.config.js";

export const addToAnimeList = async (req, res) => {
  const userId = req.user.id;
  const animeId = parseInt(req.params.animeId);
    console.log(userId)
    console.log(animeId)

  try {
    const exists = await prisma.animeList.findFirst({
      where: { userId, animeId }
    });

    if (exists) {
      return res.status(400).json({ message: "Anime already in your list." });
    }

    const added = await prisma.animeList.create({
      data: { userId, animeId }
    });

    res.status(201).json({ message: " Anime added to your list.", data: added });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: " Failed to add to anime list" });
  }
};

export const removeFromAnimeList = async (req, res) => {
  const userId = req.user.id;
  const animeId = parseInt(req.params.animeId);

  try {
    const deleted = await prisma.animeList.deleteMany({
      where: { userId, animeId }
    });

    res.status(200).json({ message: " Anime removed from your list.", deletedCount: deleted.count });
  } catch (error) {
    res.status(500).json({ message: " Failed to remove anime" });
  }
};

export const getMyAnimeList = async (req, res) => {
  const userId = req.user.id;

  try {
    const list = await prisma.animeList.findMany({
      where: { userId },
      include: { anime: true }
    });

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: " Failed to get anime list" });
  }
};

export const getMyMangaList = async (req, res) => {
  try {
    const mangaList = await prisma.mangaList.findMany({
      where: { userId: req.user.id },
      include: { manga: true },
    });

    res.status(200).json(mangaList);
  } catch (error) {
    console.error(" Error fetching manga list:", error);
    res.status(500).json({ error: "Failed to fetch manga list" });
  }
};

export const addToMangaList = async (req, res) => {
  const { mangaId } = req.params;
  try {
    const exist = await prisma.mangaList.findFirst({
      where: { userId: req.user.id, mangaId: parseInt(mangaId) },
    });

    if (exist) {
      return res.status(400).json({ msg: "Manga already in your list" });
    }

    const added = await prisma.mangaList.create({
      data: {
        userId: req.user.id,
        mangaId: parseInt(mangaId),
      },
    });

    res.status(201).json({ msg: " Manga added to your list", added });
  } catch (error) {
    console.error(" Error adding manga:", error);
    res.status(500).json({ error: "Failed to add manga" });
  }
};

export const removeFromMangaList = async (req, res) => {
  const { mangaId } = req.params;
  try {
    const deleted = await prisma.mangaList.deleteMany({
      where: {
        userId: req.user.id,
        mangaId: parseInt(mangaId),
      },
    });

    res.status(200).json({
      msg: ` Removed ${deleted.count} manga from your list`,
    });
  } catch (error) {
    console.error(" Error removing manga:", error);
    res.status(500).json({ error: "Failed to remove manga" });
  }
};

export const isAnimeInMyList = async (req, res) => {
  const userId = req.user.id;
  const animeId = parseInt(req.params.animeId);

  try {
    const exists = await prisma.animeList.findFirst({
      where: { userId, animeId },
    });

    res.status(200).json({ inList: !!exists });
  } catch (error) {
    console.error("Error checking anime in list:", error);
    res.status(500).json({ message: "Failed to check status" });
  }
};

export const isMangaInMyList = async (req, res) => {
  const userId = req.user.id;
  const mangaId = parseInt(req.params.mangaId);

  try {
    const exists = await prisma.mangaList.findFirst({
      where: { userId, mangaId },
    });

    res.status(200).json({ inList: !!exists });
  } catch (error) {
    console.error("Error checking manga in list:", error);
    res.status(500).json({ message: "Failed to check status" });
  }
};