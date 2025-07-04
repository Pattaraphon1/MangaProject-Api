import prisma from "../config/prisma.config.js";


export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany({
      omit:{
        password:true
      }
    })
    console.log(user)

    res.json({
      message: "This is List All User",
      result: user
    });
  } catch (error) {
    next(error);
  }
};

