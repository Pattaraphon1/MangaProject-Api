import express from 'express'
import { deleteUser, getUser, getUserId, searchUser, updateMe, updateUserById, updateUserRole } from '../controllers/users.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';


const userRoute = express.Router()

userRoute.get('/',verifyAdmin ,getUser)
userRoute.get("/me", verifyToken, getUserId);
userRoute.put("/me", verifyToken, updateMe);
userRoute.get("/search", verifyAdmin, searchUser); // search users
userRoute.put("/:id", verifyAdmin, updateUserById); // update user by id (admin)
userRoute.delete("/:id", verifyToken, verifyAdmin, deleteUser);
userRoute.patch("/:id/role", verifyToken, verifyAdmin, updateUserRole);


export default userRoute