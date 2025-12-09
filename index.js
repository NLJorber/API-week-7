const express = require("express");
const PORT = 3001; 
const routes = require("./routes");
const mongoose = require("mongoose");
require("dotenv").config();

//connection code
mongoose.connect(process.env.MONGODB_URI).then(() => {
console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

const app = express();

app.use(express.json()); // allows us to read the JSON body of requests



app.use("/", routes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})