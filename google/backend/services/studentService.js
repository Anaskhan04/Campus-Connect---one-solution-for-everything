const Student = require('../models/Student');

class StudentService {
  async getAllStudents(page, limit, filter = {}) {
    if (page) {
      const skip = (page - 1) * limit;
      const total = await Student.countDocuments(filter);
      const students = await Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

      return {
        students,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    return await Student.find(filter).sort({ createdAt: -1 });
  }

  async getStudentByUsername(username) {
    const student = await Student.findOne({ username });
    if (!student) {
      const err = new Error('Student not found');
      err.statusCode = 404;
      throw err;
    }
    return student;
  }

  async createStudentProfile(studentData, username) {
    studentData.username = username;

    const existingStudent = await Student.findOne({ username: studentData.username });
    if (existingStudent) {
      const err = new Error('Student profile already exists');
      err.statusCode = 400;
      throw err;
    }

    const student = new Student(studentData);
    await student.save();
    return student;
  }

  async updateStudentProfile(username, updateData, requester) {
    // Only allow users to update their own profile or admin
    if (username !== requester.username && requester.role !== 'admin') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    const student = await Student.findOneAndUpdate({ username }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      const err = new Error('Student not found');
      err.statusCode = 404;
      throw err;
    }

    return student;
  }

  async deleteStudentProfile(username) {
    const student = await Student.findOneAndDelete({ username });
    if (!student) {
      const err = new Error('Student not found');
      err.statusCode = 404;
      throw err;
    }
    return { message: 'Student profile deleted' };
  }
}

module.exports = new StudentService();
