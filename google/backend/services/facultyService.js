const Faculty = require('../models/Faculty');

class FacultyService {
  async getAllFaculty(page, limit, filter = {}) {
    if (page) {
      const skip = (page - 1) * limit;
      const total = await Faculty.countDocuments(filter);
      const faculty = await Faculty.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

      return {
        faculty,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    return await Faculty.find(filter).sort({ createdAt: -1 });
  }

  async getFacultyByUsername(username) {
    const faculty = await Faculty.findOne({ username });
    if (!faculty) {
      const err = new Error('Faculty not found');
      err.statusCode = 404;
      throw err;
    }
    return faculty;
  }

  async createFaculty(username, facultyData) {
    const existingFaculty = await Faculty.findOne({ username });
    if (existingFaculty) {
      const err = new Error('Faculty profile already exists');
      err.statusCode = 400;
      throw err;
    }

    const faculty = new Faculty({ ...facultyData, username });
    return await faculty.save();
  }

  async updateFaculty(username, updateData) {
    const faculty = await Faculty.findOneAndUpdate({ username }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!faculty) {
      const err = new Error('Faculty not found');
      err.statusCode = 404;
      throw err;
    }

    return faculty;
  }
}

module.exports = new FacultyService();
