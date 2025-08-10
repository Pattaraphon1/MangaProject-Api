import prisma from "../config/prisma.config.js";
import bcrypt from "bcryptjs";


export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      }
    });

    res.json({
      message: "This is List All User",
      result: user
    });
  } catch (error) {
    next(error);
  }
};

export const getUserId = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  const userId = req.user.id; // มาจาก verifyToken middleware
  const { username, email, password } = req.body;

  try {
    const dataToUpdate = {};
    if (username) dataToUpdate.username = username;
    // if (email) dataToUpdate.email = email;
    if (password) {
      const hashPassword = bcrypt.hashSync(password, 10);
      dataToUpdate.password = hashPassword;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    res.status(200).json({ message: "✅ Updated profile", email });
  } catch (err) {
    console.log("first")
    next(err);
    
  }
};

export const searchUser = async (req, res, next) => {
  const { q } = req.query;

  try {
    const searchQuery = `%${q.toLowerCase()}%`;

    const users = await prisma.$queryRaw`
      SELECT id, username, email, role
      FROM User
      WHERE LOWER(username) LIKE ${searchQuery}
         OR LOWER(email) LIKE ${searchQuery}
    `;

    res.json({
      message: `Search results for '${q}'`,
      result: users,
    });
  } catch (error) {
    next(error);
  }
};




// ✅ ADMIN: ลบ user
export const deleteUser = async (req, res, next) => {
  const userId = parseInt(req.params.id);

  try {
    const deleted = await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "✅ Deleted user", deleted });
  } catch (err) {
    next(err);
  }
};

// ✅ ADMIN: เปลี่ยน role user
export const updateUserRole = async (req, res, next) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body; // ADMIN หรือ USER

  if (!["ADMIN", "USER"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    res.status(200).json({ message: "✅ Role updated", updated });
  } catch (err) {
    next(err);
  }
};

export const updateUserById = async (req, res, next) => {
  const userId = parseInt(req.params.id);
  const { username, email, role } = req.body;

  if (role && !["ADMIN", "USER"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(role && { role }),
      },
    });

    res.status(200).json({ message: "✅ Updated user", updated });
  } catch (err) {
    next(err);
  }
};

