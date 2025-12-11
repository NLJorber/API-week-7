const Med = require("./med");

//get all meds
const meds = []
//request and response, in that order
exports.getAllMeds = async (req, res) => {
    try {
        const meds = await Med.find({ userId: req.userId });
        res.send(meds);
    }   catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error retrieving meds", error });
    
    }
};

exports.createMed = async (req, res) => {
    try {
    const { name, dosage, dosageAmount, dosageUnit, timeToTake, frequency, notes, profileId, quantity } = req.body;
    
    const newMed = await Med.create({ 
        userId: req.userId,
        profileId,
        name,
        dosage,
        dosageAmount,
        dosageUnit,
        timeToTake,
        frequency,
        notes,
        quantity
    });

    res.send({ message: "Medication created successfully", med: newMed });
  } catch (error) {
    res.status(500).send({ message: "Error creating medication", error: error.message });
  }
};

exports.getMedById = async (req, res) => {
    try {
    const { id } = req.params;
    const med = await Med.findOne({ _id: id, userId: req.userId });

    if (!med) {
        return res.send({ message: "Medication not found" });
    }

    res.send(med);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving medication", error })
    }
};

exports.updateMedById = async (req, res) => {
    try {
        const { id } = req.params;
    const 
    { 
        name,
        dosage,
        dosageAmount,
        dosageUnit,
        timeToTake,
        frequency,
        notes,
        quantity,
        lowStockThreshold
    } = req.body;

    const updatedMed = await Med.findOneAndUpdate(
        { _id: id, userId: req.userId }, 
        { 
        name,
        dosage,
        dosageAmount,
        dosageUnit,
        timeToTake,
        frequency,
        notes,
        quantity,
        lowStockThreshold
        }, 
        { new: true }
    );
    if (!updatedMed) {
        return res.status(404).send({ message: "Medication not found" });
    }

    res.send({ message: "Medication updated successfully", med: updatedMed  });
    } catch (error) {
        res.status(500).send({ message: "Error updating medication", error })
    }
};
exports.skipMedById = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body || {};
        const med = await Med.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { taken: false, lastSkippedAt: new Date(), skipReason: reason },
            { new: true }
        );
        if (!med) {
            return res.status(404).send({ message: "Medication not found" });
        }
        res.send({ message: "Dose marked as skipped", med });
    } catch (error) {
        res.status(500).send({ message: "Error skipping dose", error });
    }
};

exports.markMedicationTaken = async (req, res) => {
  try {
    const { id } = req.params;

    const med = await Med.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { lastTakenAt: new Date(), taken: true },
      { new: true }
    );

    if (!med) {
      return res.status(404).send({ message: "Medication not found" });
    }

    res.send({ message: "Medication marked as taken", med });
  } catch (error) {
    res.status(500).send({ message: "Error marking dose as taken", error });
  }
};

exports.deleteMedById = async (req, res) => {
  try {
    const med = await Med.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!med) return res.status(404).send({message: "Medication not found"});
    res.send({message: "Medication has been deleted"});
  }  catch (error) {
    res.status(500).send({ message: "Error deleting", error});
  }
};

exports.adjustInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        if (typeof amount !== "number") {
            return res.status(400).send({ message: "amount must be a number" });
        }

        const med = await Med.findOne({ _id: id, userId: req.userId });
        if(!med) return res.status(404).send({ message: "Medication not found" });

        med.quantity += amount;
        await med.save();

        res.send({
            message: "Inventory updated",
            quantity: med.quantity,
            lowStock: med.quantity <= med.lowStockThreshold
        });
    } catch (error) {
        res.status(500).send({ message: "Error adjusting inventory", error });
    }
}
