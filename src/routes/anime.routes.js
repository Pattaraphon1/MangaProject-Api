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

const animeRoute = express.Router();

// GET /api/anime - Get all anime from database
animeRoute.get("/", getAllAnime);

// GET /api/anime/fetch - Fetch anime from Jikan and save to DB
animeRoute.get("/fetch", fetchAndSaveTopAnime);

// GET /api/anime/search?q=naruto - Search anime by title
animeRoute.get("/search", searchAnime);

// GET /api/anime/:id - Get single anime by malId
animeRoute.get("/:id", getAnimeById);

// ลบ anime ทีละรายการ
animeRoute.delete("/:id", deleteAnimeById);

// ลบ anime ทั้งหมด
animeRoute.delete("/", deleteAllAnime);

export default animeRoute;
