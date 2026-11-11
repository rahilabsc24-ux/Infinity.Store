import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import { products } from "./data/products.js";

await connectDB(process.env.MONGO_URI);

// Replaces the product catalog (existing orders are kept)
await Product.deleteMany({});
await Product.insertMany(products.map(({ id, ...p }) => ({ slug: id, stock: 50, ...p })));
console.log(`Seeded ${products.length} products`);

const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
if (ADMIN_EMAIL && ADMIN_PASSWORD) {
  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(`Promoted ${ADMIN_EMAIL} to admin`);
  } else {
    await User.create({ name: ADMIN_NAME || "Admin", email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin" });
    console.log(`Created admin ${ADMIN_EMAIL}`);
  }
}

await mongoose.disconnect();
