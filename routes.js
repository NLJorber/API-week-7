const express = require("express");
const router = express.Router();
const { getAllMeds, createMed, getMedById, updateMedById, skipMedById, markMedicationTaken, deleteMedById, adjustInventory } = require("./medsController");
const { signUp, login } = require("./authController");
const { createProfile, getProfiles, getProfileById, updateProfile, deleteProfile } = require("./profileController");
const { createReminder, listReminders, dismissReminder, markDue } = require("./reminderController");
const auth = require("./authMiddleware");
const eventController = require("./eventController");

// base url lh 3001
router.get("/", auth, getAllMeds);
router.post("/", auth, createMed);

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

// Events calendar
router.get("/events", auth, eventController.getEvents);
router.post("/events", auth, eventController.createEvent);
router.put("/events/:id", auth, eventController.updateEvent);
router.delete("/events/:id", auth, eventController.deleteEvent);

// Meds: specific med by id (placed after other named routes to avoid conflicts)
router.get("/:id", auth, getMedById);
router.put("/:id", auth, updateMedById);
router.delete("/:id", auth, deleteMedById);
router.post("/:id/skip", auth, skipMedById);
router.post("/meds/:id/taken", auth, markMedicationTaken);
router.patch("/meds/:id/inventory", auth, adjustInventory);

module.exports = router;
