const mongoose = require("mongoose");

/* =================================================
   📂 CATEGORY SCHEMA
================================================= */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Which restaurant/owner this category belongs to
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ Unique only per owner (NOT globally)
categorySchema.index(
  { ownerId: 1, name: 1 },
  { unique: true }
);

const Category = mongoose.model("Category", categorySchema);



/* =================================================
   🍽 DISH SCHEMA
================================================= */

const dishSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required:true,
      trim: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {timestamps: true}
);
 const Dish = mongoose.model("Dish", dishSchema);



 module.exports = {
  Category,
  Dish,
 };