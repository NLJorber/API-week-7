const express = require("express");
const router = express.Router();
const { getAllMeds, createMed, getMedById, updateMedById, skipMedById, deleteMedById, adjustInventory } = require("./medsController");
const { signUp, login } = require("./authController");
const { createProfile, getProfiles, getProfileById, updateProfile, deleteProfile } = require("./profileController");
const { createReminder, listReminders, dismissReminder, markDue } = require("./reminderController");
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

//mark dose as skipped
router.post("/:id/skip", auth, skipMedById)

//This deletes a med by ID
router.delete("/:id", auth, deleteMedById);
router.patch("/meds/:id/inventory", auth, adjustInventory);

//This to authenticate user
router.post("/auth/signup", signUp);
router.post("/auth/login", login);

//This to get user profile
router.post("/profiles", auth, createProfile);
router.get("/profiles", auth, getProfiles);
router.get("/profiles/:id", auth, getProfileById);
router.put("/profiles/:id", auth, updateProfile);
router.delete("/profiles/:id", auth, deleteProfile);

//Reminders
router.post("/reminders", auth, createReminder);
router.get("/reminders", auth, listReminders);
router.post("/reminders/:id/dismiss", auth, dismissReminder);
router.post("/reminders/:id/mark-due", auth, markDue); // useful for manual testing

module.exports = router;
