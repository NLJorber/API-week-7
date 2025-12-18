const express = require("express");
const router = express.Router();
const { getAllMeds, createMed, getMedById, updateMedById, skipMedById, markMedicationTaken, deleteMedById, adjustInventory } = require("./medsController");
const { createProfile, getProfiles, getProfileById, updateProfile, deleteProfile } = require("./profileController");
const { createReminder, listReminders, dismissReminder, markDue } = require("./reminderController");
const eventController = require("./eventController");

//base url lh 3001
//get all meds
router.get("/", getAllMeds);

//get specific med by id
router.get("/:id", getMedById )

// base url again
router.post("/", createMed)

//update specific med by ID
router.put("/:id", updateMedById)

//mark dose as skipped
router.post("/:id/skip", skipMedById)

//mark med as taken
router.post("/meds/:id/taken", markMedicationTaken)

//This deletes a med by ID
router.delete("/:id", deleteMedById);
router.patch("/meds/:id/inventory", adjustInventory);

//This to get user profile
router.post("/profiles", createProfile);
router.get("/profiles", getProfiles);
router.get("/profiles/:id", getProfileById);
router.put("/profiles/:id", updateProfile);
router.delete("/profiles/:id", deleteProfile);

//Reminders
router.post("/reminders", createReminder);
router.get("/reminders", listReminders);
router.post("/reminders/:id/dismiss", dismissReminder);
router.post("/reminders/:id/mark-due", markDue); // useful for manual testing

router.post("/events", eventController.createEvent);
router.get("/events", eventController.getEvents);
router.put("/events/:id", eventController.updateEvent);
router.delete("/events/:id", eventController.deleteEvent);

module.exports = router;
