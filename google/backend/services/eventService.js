const Event = require('../models/Event');

class EventService {
  async getAllEvents(page, limit) {
    if (page) {
      const skip = (page - 1) * limit;
      const total = await Event.countDocuments();
      const events = await Event.find().sort({ date: 1 }).skip(skip).limit(limit);

      return {
        events,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    return await Event.find().sort({ date: 1 });
  }

  async getEventById(id) {
    const event = await Event.findById(id);
    if (!event) {
      const err = new Error('Event not found');
      err.statusCode = 404;
      throw err;
    }
    return event;
  }

  async createEvent(eventData, username) {
    const event = new Event({
      ...eventData,
      createdBy: username,
    });
    return await event.save();
  }

  async updateEvent(id, updateData, user) {
    const event = await Event.findById(id);
    if (!event) {
      const err = new Error('Event not found');
      err.statusCode = 404;
      throw err;
    }

    if (event.createdBy !== user.username && user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    return await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteEvent(id, user) {
    const event = await Event.findById(id);
    if (!event) {
      const err = new Error('Event not found');
      err.statusCode = 404;
      throw err;
    }

    if (event.createdBy !== user.username && user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    await Event.findByIdAndDelete(id);
    return { message: 'Event deleted' };
  }
}

module.exports = new EventService();
