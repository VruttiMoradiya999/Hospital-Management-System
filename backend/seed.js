const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();

    const usersToCreate = [
      { name: 'Admin User', email: 'admin@hospital.com', password: 'password', role: 'Admin' },
      { name: 'Dr. Jaylon Stanton', email: 'doctor@hospital.com', password: 'password', role: 'Doctor', department: 'Dentist' },
      { name: 'Dr. Carla Schleifer', email: 'carla@hospital.com', password: 'password', role: 'Doctor', department: 'Oculist' },
      { name: 'Nurse Joy', email: 'nurse@hospital.com', password: 'password', role: 'Nurse' }
    ];

    const createdUsers = await User.create(usersToCreate);
    const doctorId = createdUsers[1]._id;
    const doctor2Id = createdUsers[2]._id;

    const patientsToCreate = [
      { name: 'John Doe', age: 45, gender: 'Male', contactNumber: '123-456-7890', assignedDoctor: doctorId, treatmentStatus: 'In Treatment' },
      { name: 'Jane Smith', age: 32, gender: 'Female', contactNumber: '098-765-4321', assignedDoctor: doctorId, treatmentStatus: 'Admitted' },
      { name: 'Paityn Saris', age: 28, gender: 'Female', contactNumber: '555-0199', assignedDoctor: doctor2Id, treatmentStatus: 'In Treatment' },
      { name: 'Emery Bator', age: 52, gender: 'Male', contactNumber: '555-0188', assignedDoctor: doctorId, treatmentStatus: 'Discharged' }
    ];

    const createdPatients = await Patient.insertMany(patientsToCreate);

    const appointmentsToCreate = [
      { patient: createdPatients[0]._id, doctor: doctorId, date: new Date(), time: '10:00 AM', status: 'Pending', reason: 'Routine checkup' },
      { patient: createdPatients[1]._id, doctor: doctorId, date: new Date(), time: '11:30 AM', status: 'Completed', reason: 'Emergency' },
      { patient: createdPatients[2]._id, doctor: doctor2Id, date: new Date(), time: '02:00 PM', status: 'Pending', reason: 'Eye exam' }
    ];

    await Appointment.insertMany(appointmentsToCreate);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
