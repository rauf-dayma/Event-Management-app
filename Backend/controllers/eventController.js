import Event from "../models/eventModel.js";
// Create Event
export const createEvent = async (req, res) => {
  try {
    const { name, description, date, location, image } = req.body;

    const event = new Event({
      name,
      description,
      date,
      location,
      image, 
      createdBy: req.user, // User ID from JWT
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get All Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get Single Event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }

    const { name, description, date, location, image } = req.body;
    event.name = name || event.name;
    event.image = image || event.image;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Join Event
export const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is already in attendees list
    if (event.attendees.includes(req.user)) {
      return res.status(400).json({ message: "User already joined this event" });
    }

    // Add user to attendees list
    event.attendees.push(req.user);
    await event.save();

    // Emit real-time update
    req.io.emit("attendeeUpdated", { eventId: event._id, attendees: event.attendees.length });

    res.status(200).json({ message: "Joined event successfully", attendees: event.attendees.length });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
