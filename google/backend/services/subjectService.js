const Subject = require('../models/Subject');

class SubjectService {
  async getSubjects(username) {
    return await Subject.find({ username }).sort({ name: 1 });
  }

  async createSubject(username, subjectData) {
    const subject = new Subject({
      username,
      ...subjectData
    });
    return await subject.save();
  }

  async deleteSubject(id, username) {
    const subject = await Subject.findById(id);
    if (!subject) {
      const err = new Error('Subject not found');
      err.statusCode = 404;
      throw err;
    }
    if (subject.username !== username) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }
    await Subject.findByIdAndDelete(id);
    return { message: 'Subject deleted' };
  }

  async seedDefaultSubjects(username, subjects) {
    const existing = await Subject.find({ username });
    if (existing.length > 0) return existing;

    const subjectsToCreate = subjects.map(s => ({
      username,
      name: s.name,
      type: s.type || 'Theory'
    }));

    return await Subject.insertMany(subjectsToCreate);
  }
}

module.exports = new SubjectService();
