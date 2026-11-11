import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const str = (v) => (typeof v === "string" ? v.trim() : "");
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  const name = str(req.body?.name);
  const email = str(req.body?.email).toLowerCase();
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!isEmail(email)) return res.status(400).json({ message: "Please enter a valid email" });
  if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

  const user = await User.create({ name, email, password });
  res.status(201).json({ token: signToken(user), user: user.toPublic() });
});

router.post("/login", async (req, res) => {
  const email = str(req.body?.email).toLowerCase();
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  const user = await User.findOne({ email }).select("+password");
  const valid = user && password && (await user.comparePassword(password));
  if (!valid) return res.status(401).json({ message: "Invalid email or password" });

  res.json({ token: signToken(user), user: user.toPublic() });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user.toPublic() });
});

export default router;
