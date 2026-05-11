const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Message = require('./models/Message');
const Report = require('./models/Report');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();
    await Message.deleteMany();
    await Report.deleteMany();

    const usersToCreate = [
      { name: 'Admin User', email: 'admin@hospital.com', password: 'password', role: 'Admin' },
      { name: 'Dr. Jaylon Stanton', email: 'doctor@hospital.com', password: 'password', role: 'Doctor', department: 'Dentist' },
      { name: 'Dr. Carla Schleifer', email: 'carla@hospital.com', password: 'password', role: 'Doctor', department: 'Oculist' },
      { name: 'Nurse Joy', email: 'nurse@hospital.com', password: 'password', role: 'Nurse' }
    ];

    const createdUsers = await User.create(usersToCreate);
    const adminId = createdUsers[0]._id;
    const doctorId = createdUsers[1]._id;
    const doctor2Id = createdUsers[2]._id;
    const nurseId = createdUsers[3]._id;

    const patientsToCreate = [
      { name: 'John Doe', age: 45, gender: 'Male', contactNumber: '123-456-7890', assignedDoctor: doctorId, treatmentStatus: 'In Treatment' },
      { name: 'Jane Smith', age: 32, gender: 'Female', contactNumber: '098-765-4321', assignedDoctor: doctorId, treatmentStatus: 'Admitted' },
      { name: 'Paityn Saris', age: 28, gender: 'Female', contactNumber: '555-0199', assignedDoctor: doctor2Id, treatmentStatus: 'In Treatment' },
      { name: 'Emery Bator', age: 52, gender: 'Male', contactNumber: '555-0188', assignedDoctor: doctorId, treatmentStatus: 'Discharged' }
    ];

    const createdPatients = await Patient.insertMany(patientsToCreate);

    const appointmentsToCreate = [
      { 
        patientName: createdPatients[0].name, 
        patientContact: createdPatients[0].contactNumber, 
        doctor: doctorId, 
        date: new Date(), 
        timeSlot: '10:00 AM', 
        status: 'Scheduled', 
        reason: 'Routine checkup' 
      },
      { 
        patientName: createdPatients[1].name, 
        patientContact: createdPatients[1].contactNumber, 
        doctor: doctorId, 
        date: new Date(), 
        timeSlot: '11:30 AM', 
        status: 'Completed', 
        reason: 'Emergency' 
      },
      { 
        patientName: createdPatients[2].name, 
        patientContact: createdPatients[2].contactNumber, 
        doctor: doctor2Id, 
        date: new Date(), 
        timeSlot: '02:00 PM', 
        status: 'Scheduled', 
        reason: 'Eye exam' 
      },
      { 
        patientName: createdPatients[3].name, 
        patientContact: createdPatients[3].contactNumber, 
        doctor: doctorId, 
        date: new Date(), 
        timeSlot: '04:00 PM', 
        status: 'Scheduled', 
        reason: 'Follow-up' 
      }
    ];

    await Appointment.insertMany(appointmentsToCreate);

    const messagesToCreate = [
      { sender: adminId, recipient: doctorId, content: 'Hey Doctor, please check the new patient records.' },
      { sender: doctorId, recipient: adminId, content: 'Sure, I will look into it right away.' },
      { sender: nurseId, recipient: doctorId, content: 'Patient John Doe needs immediate attention.' },
      { sender: doctorId, recipient: nurseId, content: 'On my way to the ward.' }
    ];

    await Message.insertMany(messagesToCreate);

    const reportsToCreate = [
      { 
        title: 'Full Blood Count', 
        patient: createdPatients[0]._id, 
        doctor: doctorId, 
        category: 'Lab Result', 
        content: 'Hb: 14.5, WBC: 7.2, Platelets: 250k. All within normal range.',
        fileSize: '1.2 MB'
      },
      { 
        title: 'Chest X-Ray', 
        patient: createdPatients[1]._id, 
        doctor: doctorId, 
        category: 'Radiology', 
        content: 'No signs of infection or congestion. Lungs appear clear.',
        fileSize: '2.5 MB'
      },
      { 
        title: 'Ophthalmic Report', 
        patient: createdPatients[2]._id, 
        doctor: doctor2Id, 
        category: 'General', 
        content: 'Visual acuity 20/20 in both eyes. Slight redness noted in left eye.',
        fileSize: '840 KB'
      },
      { 
        title: 'Discharge Summary', 
        patient: createdPatients[3]._id, 
        doctor: doctorId, 
        category: 'General', 
        content: 'Patient stable, recovery complete. Advised rest for 1 week.',
        fileSize: '1.8 MB'
      }
    ];

    await Report.insertMany(reportsToCreate);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
