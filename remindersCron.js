const cron = require("node-cron");
const Reminder = require("./reminder");

function startRemindersCron() {
  // Every minute: mark pending reminders that are due
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const result = await Reminder.updateMany(
        { status: "pending", dueAt: { $lte: now } },
        { status: "due" }
      );
      if (result.modifiedCount > 0) {
        console.log(`Reminders due: ${result.modifiedCount}`);
      }
    } catch (error) {
      console.error("Error running reminder cron:", error);
    }
  });
}

module.exports = { startRemindersCron };
