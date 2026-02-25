const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    // Table number like "01", "02"
    tableNumber: { type: String, required: true, trim: true },

    // 🔥 Which restaurant/owner this table belongs to
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Unique only per owner, not globally
tableSchema.index({ ownerId: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model("Table", tableSchema);