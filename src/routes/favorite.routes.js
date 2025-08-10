import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  getMyFavorites,
  addAnimeToFavorites,
  addMangaToFavorites,
  removeAnimeFromFavorites,
  removeMangaFromFavorites,
  checkFavoriteAnime,
  checkFavoriteManga,
} from "../controllers/favorite.controller.js";

const favoriteRoute = express.Router();


favoriteRoute.get("/", verifyToken, getMyFavorites);
favoriteRoute.post("/", verifyToken)

favoriteRoute.get("/anime/:animeId", verifyToken, checkFavoriteAnime);
favoriteRoute.post("/anime/:animeId", verifyToken, addAnimeToFavorites);
favoriteRoute.delete("/anime/:animeId", verifyToken, removeAnimeFromFavorites);

favoriteRoute.get("/manga/:mangaId", verifyToken, checkFavoriteManga);
favoriteRoute.post("/manga/:mangaId", verifyToken, addMangaToFavorites);
favoriteRoute.delete("/manga/:mangaId", verifyToken, removeMangaFromFavorites);

export default favoriteRoute;
