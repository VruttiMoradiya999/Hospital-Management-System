const express = require('express');
const router = express.Router();
const { 
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus 
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(authorize('Admin', 'Nurse'), createAppointment);

router.route('/:id/status')
  .put(updateAppointmentStatus);

module.exports = router;
