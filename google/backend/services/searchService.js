const Event = require('../models/Event');
const Notice = require('../models/Notice');
const Resource = require('../models/Resource');
const Student = require('../models/Student');

class SearchService {
  async search(keyword, limit = 5) {
    if (!keyword) {
      return {
        events: [],
        notices: [],
        resources: [],
        students: [],
      };
    }

    const regex = new RegExp(keyword, 'i');

    const [events, notices, resources, students] = await Promise.all([
      Event.find({
        $or: [{ title: regex }, { description: regex }, { organizer: regex }],
      })
        .limit(limit)
        .sort({ date: 1 }),

      Notice.find({
        $or: [{ title: regex }, { tag: regex }],
      })
        .limit(limit)
        .sort({ createdAt: -1 }),

      Resource.find({
        $or: [{ title: regex }, { description: regex }],
      })
        .limit(limit)
        .sort({ createdAt: -1 }),

      Student.find({
        $or: [{ name: regex }, { username: regex }, { branch: regex }, { rollNo: regex }],
      })
        .limit(limit)
        .sort({ name: 1 }),
    ]);

    return {
      events,
      notices,
      resources,
      students,
    };
  }
}

module.exports = new SearchService();
