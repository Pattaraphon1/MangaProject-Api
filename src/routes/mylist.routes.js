import express from "express";

import {
    addToAnimeList,
    addToMangaList,
    getMyAnimeList,
    getMyMangaList,
    isAnimeInMyList,
    isMangaInMyList,
    removeFromAnimeList,
    removeFromMangaList
} from "../controllers/mylist.controller.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const mylistRoute = express.Router();

mylistRoute.get("/anime", verifyToken, getMyAnimeList);
mylistRoute.post("/anime/:animeId", verifyToken, addToAnimeList);
mylistRoute.get("/anime/status/:animeId", verifyToken, isAnimeInMyList);
mylistRoute.delete("/anime/:animeId", verifyToken, removeFromAnimeList);

mylistRoute.get("/manga", verifyToken, getMyMangaList);
mylistRoute.post("/manga/:mangaId", verifyToken, addToMangaList);
mylistRoute.get("/manga/status/:mangaId", verifyToken, isMangaInMyList);
mylistRoute.delete("/manga/:mangaId", verifyToken, removeFromMangaList);

export default mylistRoute;