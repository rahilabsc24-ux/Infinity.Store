import mongoose from "mongoose";
import { CATEGORIES } from "../constants.js";

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: [true, "Name is required"], trim: true },
    category: { type: String, enum: CATEGORIES, required: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "/placeholder.svg" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    features: { type: [String], default: [] },
    badge: { type: String, default: "" },
    stock: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

productSchema.index({ category: 1, price: 1 });

export default mongoose.model("Product", productSchema);
