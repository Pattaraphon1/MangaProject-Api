// routes/anime.routes.js
import express from "express";
import {
  getAllManga,
  getMangaById,
  searchManga,
  fetchAndSaveTopManga,
  deleteMangaById,
  deleteAllManga
} from "../controllers/manga.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import prisma from "../config/prisma.config.js";

const mangaRoute = express.Router();

mangaRoute.get("/", getAllManga);
mangaRoute.get("/search", searchManga);

mangaRoute.get('/find-by-mal/:malId', async (req, res) => {
  try {
    const malId = parseInt(req.params.malId);
    if (isNaN(malId)) return res.status(400).json({ error: 'Invalid malId' });

    const manga = await prisma.manga.findUnique({
      where: { malId },
    });

    if (!manga) return res.status(404).json({ error: 'Manga not found in database' });

    res.json(manga);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

mangaRoute.get("/fetch",verifyAdmin, fetchAndSaveTopManga);
mangaRoute.delete("/",verifyAdmin, deleteAllManga);
mangaRoute.get("/:id", getMangaById);
mangaRoute.delete("/:id",verifyAdmin, deleteMangaById);


export default mangaRoute;
