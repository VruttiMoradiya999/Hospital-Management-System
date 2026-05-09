const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).populate('assignedDoctor', 'name email');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('assignedDoctor', 'name')
      .populate('diagnosis.addedBy', 'name role')
      .populate('prescriptions.prescribedBy', 'name role')
      .populate('nurseNotes.addedBy', 'name role');
      
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private/Admin
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    const createdPatient = await patient.save();
    res.status(201).json(createdPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update patient vitals
// @route   PUT /api/patients/:id/vitals
// @access  Private/Nurse/Doctor
exports.updateVitals = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      patient.vitals = req.body.vitals;
      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add diagnosis
// @route   POST /api/patients/:id/diagnosis
// @access  Private/Doctor
exports.addDiagnosis = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      const diagnosis = {
        ...req.body,
        addedBy: req.user._id
      };
      patient.diagnosis.push(diagnosis);
      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add prescription
// @route   POST /api/patients/:id/prescription
// @access  Private/Doctor
exports.addPrescription = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      const prescription = {
        ...req.body,
        prescribedBy: req.user._id
      };
      patient.prescriptions.push(prescription);
      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add nurse note
// @route   POST /api/patients/:id/nursenotes
// @access  Private/Nurse
exports.addNurseNote = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      const note = {
        note: req.body.note,
        addedBy: req.user._id
      };
      patient.nurseNotes.push(note);
      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
