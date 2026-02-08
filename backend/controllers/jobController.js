const Job = require('../models/Job');

// @desc    Create a job posting
// @route   POST /api/jobs
// @access  Private/Alumni
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      description,
      requirements,
      salary,
      applicationLink
    } = req.body;

    // Validation
    if (!title || !company || !location || !jobType || !description || !applicationLink) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    const job = await Job.create({
      postedBy: req.user._id,
      title,
      company,
      location,
      jobType,
      description,
      requirements,
      salary,
      applicationLink
    });

    const populatedJob = await Job.findById(job._id).populate('postedBy', 'name email');

    res.status(201).json({
      message: 'Job posted successfully',
      job: populatedJob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating job' });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private (All authenticated users)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching job' });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Alumni (Own jobs only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the owner
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email');

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating job' });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Alumni (Own jobs only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the owner or admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
};

// @desc    Get my posted jobs
// @route   GET /api/jobs/my
// @access  Private/Alumni
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching your jobs' });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs
};
