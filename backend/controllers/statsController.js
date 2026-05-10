const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalStaff = await User.countDocuments();
    const totalRooms = 2150; // Still a static target for now

    // Get recent patients
    const recentPatients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('assignedDoctor', 'name');

    // Get doctor list
    const doctorList = await User.find({ role: 'Doctor' })
      .select('name role department')
      .limit(5);

    // Generate chart data (last 7 months)
    const chartData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const maleCount = await Patient.countDocuments({
        gender: 'Male',
        createdAt: { $gte: d, $lt: nextD }
      });
      
      const femaleCount = await Patient.countDocuments({
        gender: 'Female',
        createdAt: { $gte: d, $lt: nextD }
      });

      chartData.push({
        name: months[d.getMonth()],
        male: maleCount,
        female: femaleCount
      });
    }

    res.json({
      stats: {
        patients: totalPatients,
        appointments: totalAppointments,
        staff: totalStaff,
        rooms: totalRooms
      },
      recentPatients,
      doctorList,
      chartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
