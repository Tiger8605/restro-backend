const Table = require("../models/tableModel");

/**
 * helper: find the smallest missing table number for this owner
 * Example:
 *   existing: 01,02,04 => returns 03
 *   existing: 01,03    => returns 02
 */
async function getSmallestAvailableTableNumber(ownerId) {
  const tables = await Table.find({ ownerId }).select("tableNumber").lean();

  const used = new Set(
    tables
      .map((t) => parseInt(t.tableNumber, 10))
      .filter((n) => Number.isFinite(n))
  );

  let n = 1;
  while (used.has(n)) n++;

  return String(n).padStart(2, "0");
}

/**
 * helper: normalize manual input to "01", "02" ...
 * Accepts: "2", 2, "02", "  5 "
 */
function normalizeTableNumber(input) {
  const num = parseInt(String(input).trim(), 10);

  // you can change the max limit if you want
  if (!Number.isFinite(num) || num <= 0 || num > 999) return null;

  return String(num).padStart(2, "0");
}

/**
 * POST /api/tables
 * - If user sends tableNumber in body -> create that exact table number
 * - If not sent -> auto create smallest available number (fills gaps)
 */
exports.createTable = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // ✅ Read manual table number from request body
    let { tableNumber } = req.body || {};

    if (tableNumber) {
      // Manual create
      tableNumber = normalizeTableNumber(tableNumber);

      if (!tableNumber) {
        return res.status(400).json({
          success: false,
          message: "Invalid table number. Use a number like 1, 2, 10...",
        });
      }
    } else {
      // Auto create (fills gaps)
      tableNumber = await getSmallestAvailableTableNumber(ownerId);
    }

    // ✅ Save table with ownerId
    const table = await Table.create({ tableNumber, ownerId });

    const qrValue = `${process.env.CUSTOMER_APP_URL}/menu?tableId=${table._id}`;

    return res.status(201).json({
      success: true,
      data: {
        _id: table._id,
        tableNumber: table.tableNumber,
        qrValue,
        isActive: table.isActive,
      },
    });
  } catch (err) {
    // ✅ Friendly duplicate message
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Table number already exists",
      });
    }

    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/tables
 * Get all tables for logged-in admin only
 */
exports.getTables = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const tables = await Table.find({ ownerId }).sort({ createdAt: -1 }).lean();

    const data = tables.map((t) => ({
      _id: t._id,
      tableNumber: t.tableNumber,
      qrValue: `${process.env.CUSTOMER_APP_URL}/menu?tableId=${t._id}`,
      isActive: t.isActive,
      createdAt: t.createdAt,
    }));

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/tables/:id
 * Delete a table ONLY if it belongs to logged-in admin
 */
exports.deleteTable = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { id } = req.params;

    const deleted = await Table.findOneAndDelete({ _id: id, ownerId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Table not found (or you don't have access)",
      });
    }

    return res.json({ success: true, message: "Table deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};