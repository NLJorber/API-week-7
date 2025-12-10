const express = require("express");
const router = express.Router();
const { getAllMeds, createMed, getMedById, updateMedById, deleteMedById } = require("./medsController");
const { signup, login } = require("./authController");
const { createProfile, getProfiles, getProfileById, updateProfileById, deleteProfile } = require("./profileController");
const auth = require("./authMiddleware");

//base url lh 3001
//get all meds
router.get("/", auth, getAllMeds);

//get specific med by id
router.get("/:id", auth, getMedById )

// base url again
router.post("/", auth, createMed)

//update specific med by ID
router.put("/:id", auth, updateMedById)

//This deletes a med by ID
router.delete("/:id", auth, deleteMedById);

//This to authenticate user
router.post("/auth/signup", signup);
router.post("/auth/login", login);

//This to get user profile
router.post("/profiles", auth, createProfile);
router.get("/prodifles", auth, getProfiles);
router.get("/profiles/:id", auth, getProfileById);
router.put("/profiles/:id", auth, updateProfileById);
router.delete("/profiles/:id", auth, deleteProfile);





module.exports = router;