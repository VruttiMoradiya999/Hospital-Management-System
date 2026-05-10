import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Search, 
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Modal from '../components/Modal';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAppointments();
    fetchSelectionData();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectionData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/users?role=Doctor') // Need to check if userRoutes supports this query
      ]);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data.filter(u => u.role === 'Doctor'));
    } catch (error) {
      console.error("Error fetching selection data", error);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', formData);
      setIsModalOpen(false);
      setFormData({ patient: '', doctor: '', date: '', time: '', reason: '' });
      fetchAppointments();
    } catch (error) {
      alert("Error scheduling appointment: " + (error.response?.data?.message || error.message));
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-400 mt-1 font-medium">Manage patient visits and scheduling.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search appointments..." 
              className="bg-white border border-transparent focus:border-primary/20 rounded-2xl py-3 pl-12 pr-6 w-64 shadow-sm focus:outline-none transition-all font-medium text-sm"
            />
          </div>
          {(user.role === 'Admin' || user.role === 'Nurse') && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Appointment
            </button>
          )}
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {appointments.map((apt, i) => (
              <motion.div 
                key={apt._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex items-center justify-between group hover:scale-[1.01] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-xl font-bold text-gray-800 leading-none">{new Date(apt.date).getDate()}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors">{apt.patient?.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400 font-medium">
                       <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.time}</span>
                       <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {apt.doctor?.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                      {getStatusIcon(apt.status)}
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{apt.status}</span>
                   </div>
                   <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                      <MoreVertical className="w-5 h-5" />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {appointments.length === 0 && (
            <div className="glass-card p-20 text-center text-gray-400 font-bold">
               No appointments scheduled.
            </div>
          )}
        </div>

        {/* Calendar View Placeholder */}
        <div className="space-y-6">
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 text-center"
           >
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4 opacity-20" />
              <h2 className="text-lg font-bold text-gray-800 mb-2">Schedule View</h2>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Visual calendar integration coming soon to help you manage shifts better.
              </p>
           </motion.div>
           
           {/* Upcoming Shifts / Stats */}
           <div className="glass-card p-8">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Today's Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-primary/5 rounded-2xl">
                   <span className="text-sm font-bold text-gray-600">Morning Shift</span>
                   <span className="text-primary font-bold">08:00 - 14:00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl text-orange-600">
                   <span className="text-sm font-bold">Urgent Cases</span>
                   <span className="font-bold">3 High</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Schedule Appointment"
      >
        <form onSubmit={handleAddAppointment} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-600">Patient</label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50 font-medium"
              value={formData.patient}
              onChange={(e) => setFormData({...formData, patient: e.target.value})}
            >
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-600">Assigned Doctor</label>
            <select 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50 font-medium"
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
            >
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d._id} value={d._id}>{d.name} - {d.department}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-600">Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50 font-medium"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-600">Time</label>
              <input 
                required
                type="time" 
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50 font-medium"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-600">Reason / Notes</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50 font-medium resize-none h-24"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Checkup, follow-up, etc."
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] mt-4"
          >
            Confirm Schedule
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
