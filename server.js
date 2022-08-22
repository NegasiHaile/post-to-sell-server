require("dotenv").config();
const userCntrlr = require("./controllers/productCntrlr");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const schedule = require("node-schedule");

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
app.use("/api/adverts", require("./routes/advertRoutes"));
app.use("/api/banners", require("./routes/bannerRouters"));

// define the server port
const PORT = process.env.PORT || 5055;
app.listen(PORT, () => {
  console.log("Server is runnig on port ", PORT);
});

// Recurrently run the schedule at the specified time date rule bellow
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
rule.hour = 23;
rule.minute = 00;

const job = schedule.scheduleJob(rule, async (fireDate) => {
  userCntrlr.checkProductsExpirationDate();
});
