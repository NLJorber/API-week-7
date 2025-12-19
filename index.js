require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 3001; 
const routes = require("./routes");
const mongoose = require("mongoose");
const { startRemindersCron } = require("./remindersCron");

const app = express();

app.use(express.json()); // allows us to read the JSON body of requests

// quick healthcheck
app.get("/health", (req, res) => {
  const state = mongoose.connection.readyState; // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  res.send({ ok: true, dbState: state });
});

app.use("/", routes)

async function start() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const safeUri = mongoUri ? mongoUri.replace(/\/\/[^@]+@/, "//***:***@") : "(not set)";
  console.log(`Boot: connecting to MongoDB at ${safeUri}`);
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }

  startRemindersCron();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start();
