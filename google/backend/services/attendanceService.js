const Attendance = require('../models/Attendance');

class AttendanceService {
  async getAttendanceByUsername(username, user) {
    if (username !== user.username && user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    return await Attendance.find({ username }).sort({ date: -1 });
  }

  async getAttendanceStats(username, user) {
    if (username !== user.username && user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    const attendance = await Attendance.find({ username });

    const stats = {};
    attendance.forEach((record) => {
      // Exclude cancelled records from stats calculation
      if (record.status === 'cancelled') return;

      if (!stats[record.subjectId]) {
        stats[record.subjectId] = {
          subjectId: record.subjectId,
          subjectName: record.subjectName,
          total: 0,
          present: 0,
          absent: 0,
          percentage: 0,
        };
      }
      stats[record.subjectId].total++;
      if (record.status === 'attended') {
        stats[record.subjectId].present++;
      } else {
        stats[record.subjectId].absent++;
      }
    });

    Object.keys(stats).forEach((subjectId) => {
      const stat = stats[subjectId];
      stat.percentage = stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0;
    });

    return stats;
  }

  async getAttendanceBySubject(username, subjectId, user) {
    if (username !== user.username && user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    return await Attendance.find({
      username,
      subjectId,
    }).sort({ date: -1 });
  }

  async addAttendanceRecord(data, user) {
    const { username, subjectId, subjectName, date, status } = data;

    if (username !== user.username && user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    const attendance = new Attendance({
      username,
      subjectId,
      subjectName,
      date: new Date(date),
      status,
    });

    return await attendance.save();
  }

  async updateAttendanceRecord(id, updateData, user) {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      const err = new Error('Attendance record not found');
      err.statusCode = 404;
      throw err;
    }

    if (attendance.username !== user.username && user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    return await Attendance.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteAttendanceRecord(id, user) {
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      const err = new Error('Attendance record not found');
      err.statusCode = 404;
      throw err;
    }

    if (user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    await Attendance.findByIdAndDelete(id);
    return { message: 'Attendance record deleted' };
  }
}

module.exports = new AttendanceService();
