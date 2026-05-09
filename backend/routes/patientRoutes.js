const express = require('express');
const router = express.Router();
const { 
  getPatients, 
  getPatientById, 
  createPatient, 
  updateVitals, 
  addDiagnosis, 
  addPrescription, 
  addNurseNote 
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getPatients)
  .post(authorize('Admin', 'Doctor'), createPatient);

router.route('/:id')
  .get(getPatientById);

router.route('/:id/vitals')
  .put(authorize('Nurse', 'Doctor'), updateVitals);

router.route('/:id/diagnosis')
  .post(authorize('Doctor'), addDiagnosis);

router.route('/:id/prescription')
  .post(authorize('Doctor'), addPrescription);

router.route('/:id/nursenotes')
  .post(authorize('Nurse'), addNurseNote);

module.exports = router;
