// routes/anime.routes.js
import express from "express";
import {
  getAllAnime,
  getAnimeById,
  searchAnime,
  fetchAndSaveTopAnime,
  deleteAnimeById,
  deleteAllAnime
} from "../controllers/anime.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import prisma from "../config/prisma.config.js";


const animeRoute = express.Router();

animeRoute.get("/", getAllAnime);
animeRoute.get("/search", searchAnime);

animeRoute.get('/find-by-mal/:malId', async (req, res) => {
  try {
    const malId = parseInt(req.params.malId);
    if (isNaN(malId)) return res.status(400).json({ error: 'Invalid malId' });

    const anime = await prisma.anime.findUnique({
      where: { malId },
    });

    if (!anime) return res.status(404).json({ error: 'Anime not found in database' });

    res.json(anime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

animeRoute.get("/fetch",verifyAdmin, fetchAndSaveTopAnime);
animeRoute.delete("/",verifyAdmin, deleteAllAnime);
animeRoute.get("/:id", getAnimeById);
animeRoute.delete("/:id",verifyAdmin, deleteAnimeById);




export default animeRoute;
