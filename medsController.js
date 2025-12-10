const Med = require("./med");

//get all meds
const meds = []
//request and response, in that order
exports.getAllMeds = async (req, res) => {
    try {
        const meds = await Med.find();
        res.send(meds);
    }   catch (error) {
        console.log(error)
        res.status(500).send({ message: "Error retrieving meds", error });
    
    }
};

exports.createMed = async (req, res) => {
    try {
    const { name, dosage, timeToTake, frequency, notes, profileId } = req.body;
    
    const newMed = await Med.create({ 
        userId: req.userId,
        profileId,
        name,
        dosage,
        timeToTake,
        frequency,
        notes 
    });

    res.send({ message: "Medication created successfully", med: newMed });
  } catch (error) {
    res.status(500).send({ message: "Error creating medication", error: error.message });
  }
};

exports.getMedById = async (req, res) => {
    try {
    const { id } = req.params;
    const med = await Med.findById(id);

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
        timeToTake,
        frequency,
        notes 
    } = req.body;

    const updatedMed = await Med.findByIdAndUpdate(id, 
        { 
        name,
        dosage,
        timeToTake,
        frequency,
        notes 
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
        const med = await Med.findByIdAndUpdate(
            id,
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

exports.deleteMedById = async (req, res) => {
  try {
    const med = await Med.findByIdAndDelete(req.params.id);
    if (!med) return res.status(404).send({message: "Medication not found"});
    res.send({message: "Medication has been deleted"});
  }  catch (error) {
    res.status(500).send({ message: "Error deleting", error});
  }
};
