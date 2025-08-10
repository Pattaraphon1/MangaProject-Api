import jwt from 'jsonwebtoken';

export function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    req.user = decoded; // Optional: เผื่อจะใช้ user ใน controller
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
