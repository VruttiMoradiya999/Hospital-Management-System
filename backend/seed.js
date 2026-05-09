const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
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

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password', salt);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@hospital.com',
        password: password,
        role: 'Admin',
      },
      {
        name: 'Dr. Smith',
        email: 'doctor@hospital.com',
        password: password,
        role: 'Doctor',
        department: 'Cardiology'
      },
      {
        name: 'Nurse Joy',
        email: 'nurse@hospital.com',
        password: password,
        role: 'Nurse',
      }
    ];

    // Pre-hash password before insertMany because pre-save middleware doesn't run on insertMany,
    // wait, our schema has pre-save. If we use User.create(), it runs pre-save. So let's use create!
    
    // We'll use User.create but we need unhashed password because pre-save hashes it.
    const usersToCreate = [
      {
        name: 'Admin User',
        email: 'admin@hospital.com',
        password: 'password',
        role: 'Admin',
      },
      {
        name: 'Dr. Smith',
        email: 'doctor@hospital.com',
        password: 'password',
        role: 'Doctor',
        department: 'Cardiology'
      },
      {
        name: 'Nurse Joy',
        email: 'nurse@hospital.com',
        password: 'password',
        role: 'Nurse',
      }
    ];

    const createdUsers = await User.create(usersToCreate);
    const doctorId = createdUsers[1]._id;

    const patientsToCreate = [
      {
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        contactNumber: '123-456-7890',
        assignedDoctor: doctorId,
        treatmentStatus: 'In Treatment',
        vitals: {
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: 98.6,
          weight: 75
        }
      },
      {
        name: 'Jane Smith',
        age: 32,
        gender: 'Female',
        contactNumber: '098-765-4321',
        assignedDoctor: doctorId,
        treatmentStatus: 'Admitted',
      }
    ];

    await Patient.insertMany(patientsToCreate);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
