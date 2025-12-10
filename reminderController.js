const Reminder = require("./reminder");

exports.createReminder = async (req, res) => {
  try {
    const { medId, message, dueAt } = req.body;
    if (!message || !dueAt) {
      return res.status(400).send({ message: "message and dueAt are required" });
    }
    const reminder = await Reminder.create({
      userId: req.userId,
      medId,
      message,
      dueAt,
      status: "pending"
    });
    res.send(reminder);
  } catch (error) {
    res.status(500).send({ message: "Error creating reminder", error: error.message });
  }
};

exports.listReminders = async (req, res) => {
  try {
    const { status, dueBefore, dueAfter } = req.query;
    const filter = { userId: req.userId };
    if (status) filter.status = status;
    if (dueBefore) filter.dueAt = { ...(filter.dueAt || {}), $lte: new Date(dueBefore) };
    if (dueAfter) filter.dueAt = { ...(filter.dueAt || {}), $gte: new Date(dueAfter) };
    const reminders = await Reminder.find(filter).sort({ dueAt: 1 });
    res.send(reminders);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving reminders", error: error.message });
  }
};

exports.dismissReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: "dismissed" },
      { new: true }
    );
    if (!reminder) {
      return res.status(404).send({ message: "Reminder not found" });
    }
    res.send({ message: "Reminder dismissed", reminder });
  } catch (error) {
    res.status(500).send({ message: "Error dismissing reminder", error: error.message });
  }
};

// Helpful for manual testing: force a reminder to due status without waiting
exports.markDue = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: "due" },
      { new: true }
    );
    if (!reminder) {
      return res.status(404).send({ message: "Reminder not found" });
    }
    res.send({ message: "Reminder marked as due", reminder });
  } catch (error) {
    res.status(500).send({ message: "Error updating reminder", error: error.message });
  }
};
