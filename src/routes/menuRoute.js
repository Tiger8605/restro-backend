const express = require("express");
const router = express.Router();

const {protect} = require("../middleware/authMiddleware");
const {authorizeRoles} = require("../middleware/roleMiddleware");

const menuController = require("../controllers/menuController");

// =================================================
// 📂 CATEGORY MANAGEMENT
// =================================================

// ➕ Create Category
router.post(
    "/category",
    protect,
    authorizeRoles("admin"),
    menuController.createCategory
);

// Get All Categories
router.get(
    "/category",
    protect,
    authorizeRoles("admin"),
    menuController.getCategories
);

// Delete Category
router.delete(
    "/category/:id",
    protect,
    authorizeRoles("admin"),
    menuController.deleteCategory
);


// =================================================
// 🍽 DISH MANAGEMENT (Next Step Ready)
// =================================================

// ➕ Create Dish
router.post(
  "/dish",
  protect,
  authorizeRoles("admin"),
  menuController.createDish
);

// 📄 Get All Dishes
router.get(
  "/dish",
  protect,
  authorizeRoles("admin"),
  menuController.getDishes
);

// ✏️ Update Dish
router.put(
  "/dish/:id",
  protect,
  authorizeRoles("admin"),
  menuController.updateDish
);

// ❌ Delete Dish
router.delete(
  "/dish/:id",
  protect,
  authorizeRoles("admin"),
  menuController.deleteDish
);

module.exports = router;
