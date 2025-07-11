import axios from "axios";
import prisma from "../config/prisma.config.js";

const baseUrl = "https://api.jikan.moe/v4";

export const getAllManga = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 27; // ✅ แสดง 27 เรื่องต่อหน้า
  const skip = (page - 1) * pageSize;

  try {
    const [mangaList, totalCount] = await Promise.all([
      prisma.manga.findMany({
        skip,
        take: pageSize,
        orderBy: { score: "desc" },
      }),
      prisma.manga.count(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json({
      message: "Success",
      data: mangaList,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get manga list" });
  }
};


export const getMangaById = async (req, res) => {
    const { id } = req.params;
    try {
        const manga = await prisma.manga.findUnique({
            where: { malId: parseInt(id) },
        });
        if (!manga) return res.status(404).json({ error: "Not found" });
        res.json(manga);
    } catch (error) {
        res.status(500).json({ error: "Failed to get manga" });
    }
};

export const searchManga = async (req, res) => {
    const { q } = req.query;

    // ถ้าไม่ส่ง q มาเลย return empty array
    if (!q || q.trim() === "") {
        return res.status(200).json([]);
    }

    try {
        const manga = await prisma.manga.findMany({
            where: {
                title: {
                    search: q.trim(),
                },
            },
            orderBy: {
                score: "desc",
            },
            take: 50,
        });


        res.status(200).json(manga);
    } catch (error) {
        console.error("❌ Error searching manga:", error);
        res.status(500).json({ error: "Search failed" });
    }
};

export const fetchAndSaveTopManga = async (req, res) => {
  const startPage = parseInt(req.query.startPage) || 1;
  const maxPages = parseInt(req.query.limit) || 5;

  let page = startPage;
  let endPage = startPage + maxPages - 1;
  let savedManga = [];
  let skippedPages = [];

  try {
    while (page <= endPage) {
      const response = await axios.get(`${baseUrl}/top/manga?filter=bypopularity&page=${page}`);
      const mangaList = response.data.data;

      if (!mangaList || mangaList.length === 0) break;

      const malIds = mangaList.map(manga => manga.mal_id);
      const existingMangas = await prisma.manga.findMany({
        where: { malId: { in: malIds } },
        select: { malId: true }
      });
      const existingMalIds = existingMangas.map(m => m.malId);

      const allExist = malIds.every(id => existingMalIds.includes(id));
      if (allExist) {
        skippedPages.push(page);
        page++;
        continue;
      }

      for (const manga of mangaList) {
        if (!existingMalIds.includes(manga.mal_id)) {
          const saved = await prisma.manga.create({
            data: {
              malId: manga.mal_id,
              title: manga.title,
              imageUrl: manga.images?.jpg?.image_url || "",
              score: manga.score,
              status: manga.status,
              type: manga.type,
              synopsis: manga.synopsis,
              volumes: manga.volumes,
            },
          });
          savedManga.push(saved);
        }
      }

      page++;
    }

    return res.status(200).json({
      message: "✅ Fetched and saved manga.",
      savedCount: savedManga.length,
      skippedPages,
      pagesFetched: maxPages,
      fromPage: startPage,
      toPage: endPage,
    });
  } catch (error) {
    console.error("Error fetching manga:", error);
    return res.status(500).json({ error: "❌ Failed to fetch and save manga" });
  }
};

export const deleteAllManga = async (req, res) => {
    try {
        const deleted = await prisma.manga.deleteMany({});
        res.status(200).json({
            message: "✅ All manga deleted successfully",
            deletedCount: deleted.count,
        });
    } catch (error) {
        console.error("Error deleting all manga:", error);
        res.status(500).json({
            error: "❌ Failed to delete all manga",
        });
    }
};


export const deleteMangaById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedManga = await prisma.manga.delete({
            where: {
                malId: parseInt(id),
            },
        });

        res.status(200).json({
            message: `✅ Deleted manga with malId: ${id}`,
            data: deletedManga,
        });
    } catch (error) {
        console.error("Error deleting manga:", error);
        res.status(500).json({
            error: `❌ Failed to delete manga with malId: ${id}`,
        });
    }
};
