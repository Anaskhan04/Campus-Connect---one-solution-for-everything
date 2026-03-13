const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/auth');

// Configure multer for memory storage (you can change this to disk storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Upload image and return base64
router.post('/image', authMiddleware, upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No image file provided');
      error.statusCode = 400;
      throw error;
    }

    // Convert buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    res.json({
      imageUrl: base64Image,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
