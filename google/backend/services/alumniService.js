const Alumni = require('../models/Alumni');

class AlumniService {
  async getAllAlumni(page, limit) {
    if (page) {
      const skip = (page - 1) * limit;
      const total = await Alumni.countDocuments();
      const alumni = await Alumni.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

      return {
        alumni,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    return await Alumni.find().sort({ createdAt: -1 });
  }

  async seedDummyAlumni() {
    const dummyAlumni = [
      {
        username: 'alumni_rahul',
        name: 'Rahul Verma',
        branch: 'Information Technology',
        year: 2022,
        currentRole: 'Software Engineer',
        company: 'Google',
        email: 'rahul.v@example.com',
        linkedin: 'https://linkedin.com/in/rahulverma',
      },
      {
        username: 'alumni_sneha',
        name: 'Sneha Reddy',
        branch: 'Electrical Engineering',
        year: 2021,
        currentRole: 'Hardware Engineer',
        company: 'Intel',
        email: 'sneha.r@example.com',
        linkedin: 'https://linkedin.com/in/snehareddy',
      },
      {
        username: 'alumni_arjun',
        name: 'Arjun Mehta',
        branch: 'Mechanical Engineering',
        year: 2020,
        currentRole: 'Design Engineer',
        company: 'Tesla',
        email: 'arjun.m@example.com',
        linkedin: 'https://linkedin.com/in/arjunmehta',
      },
      {
        username: 'alumni_priya',
        name: 'Priya Jain',
        branch: 'Information Technology',
        year: 2023,
        currentRole: 'Data Scientist',
        company: 'Microsoft',
        email: 'priya.j@example.com',
        linkedin: 'https://linkedin.com/in/priyajain',
      },
    ];

    const existingUsernames = await Alumni.find({
      username: { $in: dummyAlumni.map((a) => a.username) },
    }).select('username');
    const existingUsernamesSet = new Set(existingUsernames.map((a) => a.username));

    const alumniToInsert = dummyAlumni.filter((a) => !existingUsernamesSet.has(a.username));

    if (alumniToInsert.length > 0) {
      await Alumni.insertMany(alumniToInsert);
      return {
        message: 'Dummy alumni data seeded successfully',
        inserted: alumniToInsert.length,
        total: await Alumni.countDocuments(),
      };
    } else {
      return {
        message: 'All dummy alumni already exist',
        total: await Alumni.countDocuments(),
      };
    }
  }

  async createAlumni(alumniData) {
    const alumni = new Alumni(alumniData);
    return await alumni.save();
  }

  async updateAlumni(id, updateData, user) {
    const alumni = await Alumni.findById(id);

    if (!alumni) {
      const err = new Error('Alumni not found');
      err.statusCode = 404;
      throw err;
    }

    if (user.role !== 'faculty' && alumni.username !== user.username) {
      const err = new Error('Unauthorized: You can only update your own profile');
      err.statusCode = 403;
      throw err;
    }

    return await Alumni.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteAlumni(id, user) {
    const alumni = await Alumni.findById(id);

    if (!alumni) {
      const err = new Error('Alumni not found');
      err.statusCode = 404;
      throw err;
    }

    if (user.role !== 'faculty' && alumni.username !== user.username) {
      const err = new Error('Unauthorized: You can only delete your own profile');
      err.statusCode = 403;
      throw err;
    }

    await Alumni.findByIdAndDelete(id);
    return { message: 'Alumni profile deleted' };
  }
}

module.exports = new AlumniService();
