const Event = require('./event');

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.userId }).populate('medication');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching events', error: err.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, start, end, medication, notes } = req.body;

        if (!title || !start || !end) {
            return res.status(400).json({ message: 'Title, start, and end are required'})
        }

        const event = await Event.create({
            title,
            start,
            end,
            medication,
            notes,
            user: req.userId
        })

        res.status(201).json(await event.populate('medication'));
    } catch (err) {
        res.status(500).json({ message: 'Error creating event', error: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, user: req.userId},
            req.body,
            { new: true }
        ).populate('medication');

        if (!event) return res.status(404).json({ message: 'Event not found'});
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: 'Error updating event', error: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting event', error: err.message });
    }
};
