import bcrypt from "bcryptjs";
import { createError } from "../utils/create.error.utils.js";
import prisma from "../config/prisma.config.js";
import jwt from 'jsonwebtoken';

export async function register(req, res, next) {
  try{
    const {email, username, password, confirmPassword} = req.body

    if (password !== confirmPassword) {
      createError(400, 'Please check confirm password')
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    });

    console.log(user)

    if (user) {
      createError(400, "Email already exist!!!")
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    console.log(hashPassword);

    const result = await prisma.user.create({
      data: {
        email:email,
        username:username,
        password: hashPassword,
      }
    })

    res.json({ message: `Register ${result.username} Success` });

  }catch(err){
    next(err)
  }
}

export async function login(req,res,next) {
    try{
      const {email,password} = req.body;

      const user = await prisma.user.findFirst({
      where: {
        email,
      }
    });
    console.log(user)
    if(!user){
      createError(400, "Email or Password is Invalid!!!");
    }

    const checkPassword = bcrypt.compareSync(password, user.password);
    if(!checkPassword){
      createError(400, "Password is Invalid!!!");
    }

    const payload = {
      id: user.id,
      role: user.role
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET , {expiresIn: '1d',});
    res.json({
      message: `Welcome back ${user.username}`,
      payload: payload,
      token: token,
    })


    }catch(err){
      next(err)
    }
}

