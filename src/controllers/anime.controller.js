import axios from "axios";
import prisma from "../config/prisma.config.js";

const baseUrl = "https://api.jikan.moe/v4";

// controllers/anime.controller.js
export const getAllAnime = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 27; // ✅ แสดง 27 เรื่องต่อหน้า
    const skip = (page - 1) * pageSize;

    try {
        const [animeList, totalCount] = await Promise.all([
            prisma.anime.findMany({
                skip,
                take: pageSize,
                orderBy: { score: "desc" },
            }),
            prisma.anime.count(),
        ]);

        const totalPages = Math.ceil(totalCount / pageSize);

        return res.status(200).json({
            message: "Success",
            data: animeList,
            currentPage: page,
            totalPages,
            totalCount,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to get anime list" });
    }
};



export const getAnimeById = async (req, res) => {
    const { id } = req.params;
    try {
        const anime = await prisma.anime.findUnique({
            where: { malId: parseInt(id) },
        });
        if (!anime) return res.status(404).json({ error: "Not found" });
        res.json(anime);
    } catch (error) {
        res.status(500).json({ error: "Failed to get anime" });
    }
};

export const searchAnime = async (req, res) => {
    const { q } = req.query;

    // ถ้าไม่ส่ง q มาเลย return empty array
    if (!q || q.trim() === "") {
        return res.status(200).json([]);
    }

    try {
        const anime = await prisma.anime.findMany({
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


        res.status(200).json(anime);
    } catch (error) {
        console.error("❌ Error searching anime:", error);
        res.status(500).json({ error: "Search failed" });
    }
};


// controllers/anime.controller.js
export const fetchAndSaveTopAnime = async (req, res) => {
    const startPage = parseInt(req.query.startPage) || 1;
    const maxPages = parseInt(req.query.limit) || 5; // จำนวนหน้าที่จะ fetch (เช่น 5 หน้า)

    let page = startPage;
    let endPage = startPage + maxPages - 1;
    let savedAnime = [];
    let skippedPages = [];

    try {
        while (page <= endPage) {
            const response = await axios.get(`${baseUrl}/top/anime?filter=bypopularity&page=${page}`);
            const animeList = response.data.data;

            if (!animeList || animeList.length === 0) {
                break;
            }

            const malIds = animeList.map(anime => anime.mal_id);
            const existingAnimes = await prisma.anime.findMany({
                where: {
                    malId: { in: malIds }
                },
                select: { malId: true }
            });
            const existingMalIds = existingAnimes.map(a => a.malId);

            // ถ้าหน้านี้มีอยู่หมดแล้ว ข้าม
            const allExist = malIds.every(id => existingMalIds.includes(id));
            if (allExist) {
                skippedPages.push(page);
                page++;
                continue;
            }

            for (const anime of animeList) {
                if (!existingMalIds.includes(anime.mal_id)) {
                    const saved = await prisma.anime.create({
                        data: {
                            malId: anime.mal_id,
                            title: anime.title,
                            imageUrl: anime.images?.jpg?.image_url || "",
                            trailer: anime.trailer?.url || "",
                            score: anime.score,
                            status: anime.status,
                            type: anime.type,
                            synopsis: anime.synopsis,
                        },
                    });
                    savedAnime.push(saved);
                }
            }

            page++;
        }

        return res.status(200).json({
            message: "✅ Fetched and saved anime.",
            savedCount: savedAnime.length,
            skippedPages,
            pagesFetched: maxPages,
            fromPage: startPage,
            toPage: endPage,
        });
    } catch (error) {
        console.error("Error fetching anime:", error);
        return res.status(500).json({ error: "❌ Failed to fetch and save anime" });
    }
};


export const deleteAllAnime = async (req, res) => {
    try {
        const deleted = await prisma.anime.deleteMany({});
        res.status(200).json({
            message: "✅ All anime deleted successfully",
            deletedCount: deleted.count,
        });
    } catch (error) {
        console.error("Error deleting all anime:", error);
        res.status(500).json({
            error: "❌ Failed to delete all anime",
        });
    }
};


export const deleteAnimeById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAnime = await prisma.anime.delete({
            where: {
                malId: parseInt(id),
            },
        });

        res.status(200).json({
            message: `✅ Deleted anime with malId: ${id}`,
            data: deletedAnime,
        });
    } catch (error) {
        console.error("Error deleting anime:", error);
        res.status(500).json({
            error: `❌ Failed to delete anime with malId: ${id}`,
        });
    }
};
