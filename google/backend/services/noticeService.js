const Notice = require('../models/Notice');
const io = require('../utils/socket');

class NoticeService {
  async getAllNotices(page, limit) {
    if (page) {
      const skip = (page - 1) * limit;
      const total = await Notice.countDocuments();
      const notices = await Notice.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

      return {
        notices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    return await Notice.find().sort({ createdAt: -1 });
  }

  async getNoticeById(id) {
    const notice = await Notice.findById(id);
    if (!notice) {
      const err = new Error('Notice not found');
      err.statusCode = 404;
      throw err;
    }
    return notice;
  }

  async createNotice(noticeData, username) {
    const data = {
      ...noticeData,
      createdBy: username,
      date:
        noticeData.date ||
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
    };

    const notice = new Notice(data);
    await notice.save();

    // Broadcast new notice to all connected clients
    try {
      io.getIO().emit('new_notice', notice);
    } catch(e) {
      console.error('Socket error:', e);
    }

    return notice;
  }

  async updateNotice(id, updateData) {
    const notice = await Notice.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!notice) {
      const err = new Error('Notice not found');
      err.statusCode = 404;
      throw err;
    }

    return notice;
  }

  async deleteNotice(id) {
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      const err = new Error('Notice not found');
      err.statusCode = 404;
      throw err;
    }

    return { message: 'Notice deleted' };
  }
}

module.exports = new NoticeService();
