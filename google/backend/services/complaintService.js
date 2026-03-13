const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const Faculty = require('../models/Faculty');
const User = require('../models/User');
const io = require('../utils/socket');

class ComplaintService {
  async getComplaintsByUsername(username, page, limit) {
    const filter = { username };
    if (page) {
      const skip = (page - 1) * limit;
      const total = await Complaint.countDocuments(filter);
      const complaints = await Complaint.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        complaints,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    return await Complaint.find(filter).sort({ createdAt: -1 });
  }

  async getAllComplaints(page, limit) {
    if (page) {
      const skip = (page - 1) * limit;
      const total = await Complaint.countDocuments();
      const complaints = await Complaint.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

      return {
        complaints,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    return await Complaint.find().sort({ createdAt: -1 });
  }

  async getComplaintById(id, user) {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      throw err;
    }

    if (complaint.username !== user.username && user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    return complaint;
  }

  async createComplaint(complaintData, username) {
    const complaint = new Complaint({
      ...complaintData,
      username,
    });
    await complaint.save();

    // Create notifications for relevant faculty
    await this._createNotificationsForComplaint(complaint, username);

    return complaint;
  }

  async _createNotificationsForComplaint(complaint, username) {
    const categoryMapping = {
      Director: 'Director',
      HOD: 'HOD',
      'Dean (DSW)': 'Dean',
      'Placement Cell': 'Placement Officer',
      'Anti Ragging': 'Anti Ragging Officer',
      'Hostel Warden': 'Hostel Warden',
      Registrar: 'Registrar',
      'Direct to AKTU': 'AKTU',
      Other: 'Other',
    };

    const designation = categoryMapping[complaint.category] || 'Other';

    const query = { designation: designation };
    if (complaint.subCategory) {
      const branchMapping = {
        IT: 'Information Technology',
        EE: 'Electrical Engineering',
        ME: 'Mechanical Engineering',
      };
      query.branch = branchMapping[complaint.subCategory] || complaint.subCategory;
    }

    let facultyMembers = await Faculty.find(query);

    if (facultyMembers.length === 0) {
      facultyMembers = await Faculty.find().limit(5);
    }

    // Get user IDs for all faculty members
    const facultyUsernames = facultyMembers.map((f) => f.username);
    const users = await User.find({ username: { $in: facultyUsernames } }, '_id username');
    const userMap = users.reduce((acc, user) => {
      acc[user.username] = user._id;
      return acc;
    }, {});

    const notifications = facultyMembers.map((faculty) => ({
      recipient: faculty.username,
      userId: userMap[faculty.username],
      type: 'complaint',
      title: `New Complaint: ${complaint.subject}`,
      message: `You have received a new complaint in category "${complaint.category}"${complaint.subCategory ? ` - ${complaint.subCategory}` : ''} from ${username}`,
      complaintId: complaint._id,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      
      try {
        const ioInstance = io.getIO();
        notifications.forEach(n => {
          ioInstance.to(n.recipient).emit('new_notification', n);
        });
      } catch(e) {
        console.error('Socket error:', e);
      }
    }
  }

  async updateComplaintStatus(id, status) {
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      throw err;
    }

    // Create notification for the student
    const notification = new Notification({
      recipient: complaint.username,
      type: 'complaint',
      title: 'Complaint Status Updated',
      message: `Your complaint regarding "${complaint.subject}" is now ${status}.`,
      complaintId: complaint._id
    });
    
    // Find User to populate userId
    const userDoc = await User.findOne({ username: complaint.username });
    if (userDoc) {
      notification.userId = userDoc._id;
    }
    
    await notification.save();

    // Emit socket event
    try {
      const ioInstance = io.getIO();
      ioInstance.to(complaint.username).emit('new_notification', notification);
    } catch(e) {
      console.error('Socket error:', e);
    }

    return complaint;
  }

  async deleteComplaint(id, username) {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      const err = new Error('Complaint not found');
      err.statusCode = 404;
      throw err;
    }

    if (complaint.username !== username) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    await Complaint.findByIdAndDelete(id);
    return { message: 'Complaint deleted' };
  }
}

module.exports = new ComplaintService();
