import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  Search, 
  Plus, 
  FileText, 
  Activity, 
  MoreVertical,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

import Modal from '../components/Modal';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contactNumber: '',
    treatmentStatus: 'In Treatment'
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patients', formData);
      setIsModalOpen(false);
      setFormData({ name: '', age: '', gender: 'Male', contactNumber: '', treatmentStatus: 'In Treatment' });
      fetchPatients();
    } catch (error) {
      alert("Error adding patient: " + (error.response?.data?.message || error.message));
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Admitted': return 'bg-red-50 text-red-500 border-red-100';
      case 'In Treatment': return 'bg-orange-50 text-orange-500 border-orange-100';
      case 'Discharged': return 'bg-emerald-50 text-emerald-500 border-emerald-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
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
          <h1 className="text-3xl font-bold text-gray-800">Patients Directory</h1>
          <p className="text-gray-400 mt-1 font-medium">Manage and monitor patient health records.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="bg-white border border-transparent focus:border-primary/20 rounded-2xl py-3 pl-12 pr-6 w-64 shadow-sm focus:outline-none transition-all font-medium text-sm"
            />
          </div>
          <button className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-primary transition-all">
            <Filter className="w-5 h-5" />
          </button>
          {(user.role === 'Admin' || user.role === 'Doctor') && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add Patient
            </button>
          )}
        </div>
      </header>

      {/* Main Table Container */}
      <div 
        className="glass-card overflow-hidden"
      >
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">All Patients</h2>
          <button className="text-gray-400 hover:text-primary transition-colors">
             <Download className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-50">
                <th className="px-8 py-5">Patient Info</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Assigned Doctor</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {patients.length > 0 ? patients.map((patient, i) => (
                <tr 
                  key={patient._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 group-hover:text-primary transition-colors">{patient.name}</div>
                        <div className="text-xs text-gray-400 font-bold mt-0.5">{patient.age} Yrs • {patient.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-gray-600">{patient.contactNumber}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(patient.treatmentStatus)}`}>
                      {patient.treatmentStatus || 'In Treatment'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                         DR
                       </div>
                       <span className="text-sm font-bold text-gray-600">{patient.assignedDoctor?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="View Records">
                        <FileText className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all" title="Update Vitals">
                        <Activity className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <Users className="w-16 h-16 text-gray-100" />
                       <p className="text-gray-400 font-bold">No patient records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-6 border-t border-gray-50 flex justify-center">
           <div className="flex gap-2">
              {[1, 2, 3].map(n => (
                <button key={n} className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${n === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-100'}`}>
                  {n}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Patient"
      >
        <form onSubmit={handleAddPatient} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-600">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50 font-medium"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-600">Age</label>
              <input 
                required
                type="number" 
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50 font-medium"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-600">Gender</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50 font-medium"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-600">Contact Number</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:border-primary/50 outline-none transition-all bg-gray-50 font-medium"
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] mt-6"
          >
            Create Patient Record
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Patients;
