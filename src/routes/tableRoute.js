const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const tableController = require("../controllers/tableController");

// admin only
router.get("/", protect, authorizeRoles("admin"), tableController.getTables);
router.post("/", protect, authorizeRoles("admin"), tableController.createTable);
router.delete("/:id", protect, authorizeRoles("admin"), tableController.deleteTable);

// router.get("/", tableController.getTables);
// router.post("/", tableController.createTable);
// router.delete("/:id", tableController.deleteTable);

module.exports = router;