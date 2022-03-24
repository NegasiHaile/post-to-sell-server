require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Connect to mongodb
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
  }
);

// Root APIs
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/advert", require("./routes/advertRoutes"));

// define the server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is runnig on port ", PORT);
});
