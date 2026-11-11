import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { CATEGORIES } from "../constants.js";

const router = Router();

const SORTS = {
  featured: { reviews: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1 },
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const slugify = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Only these fields may be written through the API.
const WRITABLE = ["name", "category", "price", "rating", "reviews", "image", "tagline", "description", "features", "badge", "stock"];
function pickWritable(body = {}) {
  const data = {};
  for (const key of WRITABLE) if (body[key] !== undefined) data[key] = body[key];
  return data;
}

// GET /api/products?category=&q=&sort=
router.get("/", async (req, res) => {
  const { category, q, sort } = req.query;
  const filter = {};

  if (category !== undefined) {
    if (!CATEGORIES.includes(category)) return res.status(400).json({ message: "Unknown category" });
    filter.category = category;
  }
  if (typeof q === "string" && q.trim()) {
    const rx = new RegExp(escapeRegex(q.trim()), "i");
    filter.$or = [{ name: rx }, { tagline: rx }, { category: rx }];
  }

  const products = await Product.find(filter).sort(SORTS[sort] ?? SORTS.featured);
  res.json(products);
});

router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// Admin: create
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const data = pickWritable(req.body);
  data.slug = slugify(req.body?.slug || data.name || "");
  const product = await Product.create(data);
  res.status(201).json(product);
});

// Admin: update
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, pickWritable(req.body), {
    new: true,
    runValidators: true,
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// Admin: delete
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

export default router;
