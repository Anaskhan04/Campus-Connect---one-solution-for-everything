const Resource = require('../models/Resource');

class ResourceService {
  async getAllResources(page, limit, filter = {}) {
    if (page) {
      const skip = (page - 1) * limit;
      const total = await Resource.countDocuments(filter);
      const resources = await Resource.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

      return {
        resources,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    return await Resource.find(filter).sort({ createdAt: -1 });
  }

  async getResourceById(id) {
    const resource = await Resource.findById(id);
    if (!resource) {
      const err = new Error('Resource not found');
      err.statusCode = 404;
      throw err;
    }
    return resource;
  }

  async createResource(resourceData, username) {
    const resource = new Resource({
      ...resourceData,
      uploadedBy: username,
    });
    return await resource.save();
  }

  async updateResource(id, updateData, user) {
    const resource = await Resource.findById(id);
    if (!resource) {
      const err = new Error('Resource not found');
      err.statusCode = 404;
      throw err;
    }

    if (resource.uploadedBy !== user.username && user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    return await Resource.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteResource(id, user) {
    const resource = await Resource.findById(id);
    if (!resource) {
      const err = new Error('Resource not found');
      err.statusCode = 404;
      throw err;
    }

    if (resource.uploadedBy !== user.username && user.role !== 'faculty') {
      const err = new Error('Unauthorized');
      err.statusCode = 403;
      throw err;
    }

    await Resource.findByIdAndDelete(id);
    return { message: 'Resource deleted' };
  }
}

module.exports = new ResourceService();
