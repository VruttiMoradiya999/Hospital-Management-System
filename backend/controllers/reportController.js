const Report = require('../models/Report');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    console.log('Fetching reports...');
    const reports = await Report.find()
      .populate('patient', 'name')
      .populate('doctor', 'name');
    console.log(`Found ${reports.length} reports`);
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error in getReports:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
