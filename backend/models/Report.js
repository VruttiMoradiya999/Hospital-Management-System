const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['Lab Result', 'Radiology', 'Prescription', 'General'],
      default: 'General',
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Draft', 'Finalized'],
      default: 'Finalized',
    },
    fileSize: {
      type: String,
      default: '1.2 MB',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Report', reportSchema);
