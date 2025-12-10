const Profile = require("./profile");

exports.createProfile = async (req, res) => {
  try {
    const { name, type, notes } = req.body;
    if (!name) {
      return res.status(400).send({ message: "name is required" });
    }
    const profile = await Profile.create({ userId: req.userId, name, type, notes });
    res.send({ message: "Profile created", profile });
  } catch (error) {
    res.status(500).send({ message: "Error creating profile", error: error.message });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.userId });
    res.send(profiles);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving profiles", error: error.message });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, userId: req.userId });
    if (!profile) {
      return res.status(404).send({ message: "Profile not found" });
    }
    res.send(profile);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving profile", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, type, notes } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, type, notes },
      { new: true }
    );
    if (!profile) {
      return res.status(404).send({ message: "Profile not found" });
    }
    res.send({ message: "Profile updated", profile });
  } catch (error) {
    res.status(500).send({ message: "Error updating profile", error: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!profile) {
      return res.status(404).send({ message: "Profile not found" });
    }
    res.send({ message: "Profile deleted" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting profile", error: error.message });
  }
};