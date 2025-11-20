const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const authMiddleware = require('../middleware/auth');

// Get all complaints for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ username: req.user.username })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all complaints (for faculty/admin)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get complaint by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Users can only view their own complaints, faculty can view all
    if (complaint.username !== req.user.username && req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create complaint
router.post('/', authMiddleware, async (req, res) => {
  try {
    const Notification = require('../models/Notification');
    const Faculty = require('../models/Faculty');
    
    const complaintData = {
      ...req.body,
      username: req.user.username
    };
    const complaint = new Complaint(complaintData);
    await complaint.save();
    
    // Create notification for relevant faculty based on category
    // Map category to faculty designation
    const categoryMapping = {
      "Director": "Director",
      "HOD": "HOD",
      "Dean (DSW)": "Dean",
      "Placement Cell": "Placement Officer",
      "Anti Ragging": "Anti Ragging Officer",
      "Hostel Warden": "Hostel Warden",
      "Registrar": "Registrar",
      "Direct to AKTU": "AKTU",
      "Other": "Other"
    };
    
    const designation = categoryMapping[complaint.category] || "Other";
    
    // Find faculty members with matching designation
    // If subcategory exists (like HOD - IT), also match by branch
    const query = { designation: designation };
    if (complaint.subCategory) {
      // Map subcategory to branch if it's a department
      const branchMapping = {
        "IT": "Information Technology",
        "EE": "Electrical Engineering",
        "ME": "Mechanical Engineering"
      };
      query.branch = branchMapping[complaint.subCategory] || complaint.subCategory;
    }
    
    const facultyMembers = await Faculty.find(query);
    
    // Create notifications for all matching faculty members
    for (const faculty of facultyMembers) {
      const notification = new Notification({
        recipient: faculty.username,
        type: 'complaint',
        title: `New Complaint: ${complaint.subject}`,
        message: `You have received a new complaint in category "${complaint.category}"${complaint.subCategory ? ` - ${complaint.subCategory}` : ''} from ${req.user.username}`,
        complaintId: complaint._id
      });
      await notification.save();
    }
    
    // If no specific faculty found, notify all faculty (fallback)
    if (facultyMembers.length === 0) {
      const allFaculty = await Faculty.find().limit(5); // Limit to avoid spam
      for (const faculty of allFaculty) {
        const notification = new Notification({
          recipient: faculty.username,
          type: 'complaint',
          title: `New Complaint: ${complaint.subject}`,
          message: `You have received a new complaint in category "${complaint.category}" from ${req.user.username}`,
          complaintId: complaint._id
        });
        await notification.save();
      }
    }
    
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update complaint status (for faculty)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete complaint
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Users can only delete their own complaints
    if (complaint.username !== req.user.username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

