const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json()); // Required to read req.body

app.get("/", (req, res) => {
  res.send("API is running");
});

// User routes
app.use("/api/user", userRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
