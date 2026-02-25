const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const adminAuthRoutes = require("./routes/adminAuthRoute"); 
const tableRoutes = require("./routes/tableRoute");


const { errorHandler } = require("./middleware/errorMiddleware");


const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => res.send("API Running ✅"));



// 👇 Admin routes
app.use("/api/admin", adminAuthRoutes); // ✅ ADD THIS
app.use("/api/tables", tableRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`✅ Server running on http://localhost:${PORT}`)
  );
});