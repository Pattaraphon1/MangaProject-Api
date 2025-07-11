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

const mangaRoute = express.Router();

mangaRoute.get("/", getAllManga);

mangaRoute.get("/fetch", fetchAndSaveTopManga);

mangaRoute.get("/search", searchManga);

mangaRoute.get("/:id", getMangaById);

mangaRoute.delete("/:id", deleteMangaById);

mangaRoute.delete("/", deleteAllManga);

export default mangaRoute;
