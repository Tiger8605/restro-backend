const Order = require("../models/orderModel");

/**
 * GET /api/orders/active/:tableId
 * Returns active order for selected table (if exists)
 */
exports.getActiveOrderByTable = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { tableId } = req.params;

    const order = await Order.findOne({
      ownerId,
      tableId,
      status: "active",
    }).lean();

    return res.json({ success: true, data: order || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/orders/place
 * Creates or updates active order for table
 */
exports.placeOrder = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { tableId, items } = req.body;

    if (!tableId) {
      return res.status(400).json({ success: false, message: "tableId is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "items are required" });
    }

    // If active order already exists -> update it (add/replace items)
    let order = await Order.findOne({ ownerId, tableId, status: "active" });

    if (!order) {
      order = await Order.create({
        ownerId,
        tableId,
        items,
        status: "active",
      });
    } else {
      // Replace items (simple approach)
      order.items = items;
      await order.save();
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PATCH /api/orders/:id/pay
 * Marks order paid -> table becomes free
 */
exports.payOrder = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { id } = req.params;

    const order = await Order.findOneAndUpdate(
      { _id: id, ownerId },
      { status: "paid" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};