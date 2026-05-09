const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    assignedDoctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    vitals: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      weight: Number,
    },
    diagnosis: [{
      condition: String,
      date: { type: Date, default: Date.now },
      notes: String,
      addedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
    }],
    prescriptions: [{
      medicationName: String,
      dosage: String,
      frequency: String,
      duration: String,
      date: { type: Date, default: Date.now },
      prescribedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
    }],
    nurseNotes: [{
      note: String,
      date: { type: Date, default: Date.now },
      addedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
    }],
    treatmentStatus: {
      type: String,
      enum: ['Admitted', 'In Treatment', 'Discharged'],
      default: 'In Treatment'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Patient', patientSchema);
