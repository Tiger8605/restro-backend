const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const orderController = require("../controllers/orderController");

// admin only
router.get(
  "/active/:tableId",
  protect,
  authorizeRoles("admin"),
  orderController.getActiveOrderByTable
);

router.post(
  "/place",
  protect,
  authorizeRoles("admin"),
  orderController.placeOrder
);

router.patch(
  "/:id/pay",
  protect,
  authorizeRoles("admin"),
  orderController.payOrder
);

module.exports = router;