import Announcement from '../models/Announcement.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
export const getAnnouncements = async (req, res) => {
  try {
    const { priority, targetAudience } = req.query;
    
    const query = { isPublished: true };
    
    if (priority) query.priority = priority;
    if (targetAudience) query.targetAudience = { $in: [targetAudience] };

    const announcements = await Announcement.find(query)
      .populate('author', 'firstName lastName')
      .populate('classes', 'name grade section')
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
export const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'firstName lastName email')
      .populate('classes', 'name grade section');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Increment views
    announcement.views += 1;
    
    // Add to readBy if not already read
    const alreadyRead = announcement.readBy.find(
      read => read.user.toString() === req.user.id
    );
    
    if (!alreadyRead) {
      announcement.readBy.push({
        user: req.user.id,
        readAt: new Date()
      });
    }

    await announcement.save();

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin/Teacher
export const createAnnouncement = async (req, res) => {
  try {
    const announcementData = {
      ...req.body,
      author: req.user.id
    };

    // Handle file uploads
    if (req.files) {
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
      const uploadedFiles = [];

      for (const file of files) {
        const result = await uploadToCloudinary(file, 'announcements');
        uploadedFiles.push({
          name: file.name,
          url: result.url,
          type: file.mimetype,
          size: file.size,
          publicId: result.publicId
        });
      }

      announcementData.attachments = uploadedFiles;
    }

    const announcement = await Announcement.create(announcementData);

    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('author', 'firstName lastName')
      .populate('classes', 'name grade section');

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('new-announcement', populatedAnnouncement);
    }

    res.status(201).json({
      success: true,
      data: populatedAnnouncement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin/Teacher
export const updateAnnouncement = async (req, res) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user is the author or admin
    if (announcement.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this announcement'
      });
    }

    // Handle new file uploads
    if (req.files) {
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
      const uploadedFiles = [];

      for (const file of files) {
        const result = await uploadToCloudinary(file, 'announcements');
        uploadedFiles.push({
          name: file.name,
          url: result.url,
          type: file.mimetype,
          size: file.size,
          publicId: result.publicId
        });
      }

      req.body.attachments = [...(announcement.attachments || []), ...uploadedFiles];
    }

    announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'firstName lastName')
     .populate('classes', 'name grade section');

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update announcement',
      error: error.message
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin/Teacher
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Check if user is the author or admin
    if (announcement.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement'
      });
    }

    // Delete files from Cloudinary
    if (announcement.attachments && announcement.attachments.length > 0) {
      for (const file of announcement.attachments) {
        if (file.publicId) {
          await deleteFromCloudinary(file.publicId);
        }
      }
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};