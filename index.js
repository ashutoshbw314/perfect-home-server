require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRouter = require("./routes/apiRoutes");

const app = express();

const PORT = process.env.PORT || 8080;


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvkxi.mongodb.net/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once("open", () => {
  console.log("Mongodb connection established successfully");
});

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
