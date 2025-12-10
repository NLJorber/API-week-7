require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 3001; 
const routes = require("./routes");
const mongoose = require("mongoose");
const { startRemindersCron } = require("./remindersCron");

//connection code
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
mongoose.connect(mongoUri).then(() => {
console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

const app = express();

app.use(express.json()); // allows us to read the JSON body of requests
// simple static frontend available at /app
app.use("/app", express.static("public"));

app.use("/", routes)

startRemindersCron();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
