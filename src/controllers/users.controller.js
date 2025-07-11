import prisma from "../config/prisma.config.js";
import { createError } from "../utils/create.error.utils.js";


export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany({
      omit:{
        password:true
      }
    })

      
    res.json({
      message: "This is List All User",
      result: user
    });
  } catch (error) {
    next(error);
  }
};

