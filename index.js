const express = require("express");
const mongoose = require("mongoose");
const app = express();
const fileRoutes = require("./routes/fileRoutes");
const cors = require("cors");

const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/4rum-files", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api", fileRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
