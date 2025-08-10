import prisma from "../config/prisma.config.js";

export const getMyFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        anime: true,
        manga: true,
      },
    });

    res.status(200).json(favorites);
  } catch (error) {
    console.error("❌ Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

export const checkFavoriteAnime = async (req, res) => {
  try {
    const animeId = parseInt(req.params.animeId);
    const userId = req.user.id;

    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        animeId,
      },
    });

    res.status(200).json({ isFavorite: !!existing });
  } catch (error) {
    console.error("❌ Error checking favorite anime:", error);
    res.status(500).json({ error: "Failed to check favorite" });
  }
};

export const checkFavoriteManga = async (req, res) => {
  try {
    const mangaId = parseInt(req.params.mangaId);
    const userId = req.user.id;

    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        mangaId,
      },
    });

    res.status(200).json({ isFavorite: !!existing });
  } catch (error) {
    console.error("❌ Error checking favorite manga:", error);
    res.status(500).json({ error: "Failed to check favorite" });
  }
};

export const addAnimeToFavorites = async (req, res) => {
  const { animeId } = req.params;
  try {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: req.user.id,
        animeId: parseInt(animeId),
      },
    });

    if (existing) {
      return res.status(400).json({ msg: "Anime already in favorites" });
    }

    const created = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        animeId: parseInt(animeId),
      },
    });

    res.status(201).json({ msg: "✅ Anime added to favorites", created });
  } catch (error) {
    console.error("❌ Error adding anime to favorites:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

export const addMangaToFavorites = async (req, res) => {
  const { mangaId } = req.params;
  try {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: req.user.id,
        mangaId: parseInt(mangaId),
      },
    });

    if (existing) {
      return res.status(400).json({ msg: "Manga already in favorites" });
    }

    const created = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        mangaId: parseInt(mangaId),
      },
    });

    res.status(201).json({ msg: "✅ Manga added to favorites", created });
  } catch (error) {
    console.error("❌ Error adding manga to favorites:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

export const removeAnimeFromFavorites = async (req, res) => {
  const { animeId } = req.params;
  try {
    const deleted = await prisma.favorite.deleteMany({
      where: {
        userId: req.user.id,
        animeId: parseInt(animeId),
      },
    });

    res.status(200).json({ msg: `✅ Removed ${deleted.count} anime from favorites` });
  } catch (error) {
    console.error("❌ Error removing anime from favorites:", error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};

export const removeMangaFromFavorites = async (req, res) => {
  const { mangaId } = req.params;
  try {
    const deleted = await prisma.favorite.deleteMany({
      where: {
        userId: req.user.id,
        mangaId: parseInt(mangaId),
      },
    });

    res.status(200).json({ msg: `✅ Removed ${deleted.count} manga from favorites` });
  } catch (error) {
    console.error("❌ Error removing manga from favorites:", error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};
