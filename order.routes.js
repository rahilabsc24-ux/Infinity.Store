import { Router } from "express";
import crypto from "node:crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING, ORDER_STATUSES } from "../constants.js";

const router = Router();
router.use(requireAuth);

const money = (n) => Math.round(n * 100) / 100;
const str = (v) => (typeof v === "string" ? v.trim() : "");

async function nextOrderNumber() {
  for (;;) {
    const candidate = `INF-${crypto.randomInt(100000, 1000000)}`;
    if (!(await Order.exists({ orderNumber: candidate }))) return candidate;
  }
}

// POST /api/orders — prices are always recalculated from the database, never trusted from the client
router.post("/", async (req, res) => {
  const { items, shippingAddress, cardLast4 } = req.body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty" });
  }

  const address = {
    firstName: str(shippingAddress?.firstName),
    lastName: str(shippingAddress?.lastName),
    email: str(shippingAddress?.email).toLowerCase(),
    address: str(shippingAddress?.address),
    city: str(shippingAddress?.city),
    zip: str(shippingAddress?.zip),
  };
  if (Object.values(address).some((v) => !v)) {
    return res.status(400).json({ message: "Please complete all shipping fields" });
  }

  // Merge duplicate lines and clamp quantities
  const wanted = new Map();
  for (const item of items) {
    const slug = str(item?.slug);
    const qty = Math.min(10, Math.max(1, Math.floor(Number(item?.quantity) || 1)));
    if (!slug) return res.status(400).json({ message: "Invalid cart item" });
    wanted.set(slug, (wanted.get(slug) ?? 0) + qty);
  }

  const products = await Product.find({ slug: { $in: [...wanted.keys()] } });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const lines = [];
  for (const [slug, quantity] of wanted) {
    const product = bySlug.get(slug);
    if (!product) return res.status(400).json({ message: `Product no longer available: ${slug}` });
    if (product.stock < quantity) {
      return res.status(409).json({ message: `Only ${product.stock} of "${product.name}" left in stock` });
    }
    lines.push({ product, quantity });
  }

  // Reserve stock; roll back if another order grabbed it first
  const reserved = [];
  for (const { product, quantity } of lines) {
    const result = await Product.updateOne(
      { _id: product._id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
    );
    if (result.modifiedCount === 0) {
      await Promise.all(reserved.map((r) => Product.updateOne({ _id: r.product._id }, { $inc: { stock: r.quantity } })));
      return res.status(409).json({ message: `"${product.name}" just sold out. Please update your cart.` });
    }
    reserved.push({ product, quantity });
  }

  const subtotal = money(lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0));
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = money(subtotal * TAX_RATE);
  const total = money(subtotal + shipping + tax);

  const order = await Order.create({
    orderNumber: await nextOrderNumber(),
    user: req.user._id,
    items: lines.map(({ product, quantity }) => ({
      product: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })),
    shippingAddress: address,
    payment: { method: "demo-card", last4: String(cardLast4 ?? "").replace(/\D/g, "").slice(-4) },
    subtotal,
    shipping,
    tax,
    total,
  });

  res.status(201).json(order);
});

// GET /api/orders/mine — current user's orders
router.get("/mine", async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders — admin: every order
router.get("/", requireAdmin, async (_req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

// PATCH /api/orders/:id/status — admin
router.patch("/:id/status", requireAdmin, async (req, res) => {
  const status = req.body?.status;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${ORDER_STATUSES.join(", ")}` });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

export default router;
