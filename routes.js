const express = require("express");
const router = express.Router();
const { getAllMeds, createMed, getMedById, updateMedById } = require("./medsController")

//base url lh 3001
//get all meds
router.get("/", getAllMeds);

//get specific med by id
router.get("/:id",getMedById )

// base url again
router.post("/", createMed)

//update specific med by ID
router.put("/:id", updateMedById)

module.exports = router;