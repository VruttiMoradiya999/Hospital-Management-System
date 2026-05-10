import React from 'react';
import { FileText, Download, TrendingUp, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Reports = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Medical Reports</h1>
        <p className="text-gray-400 mt-1 font-medium">Analytical overview of hospital operations and patient metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { title: 'Patient Statistics', icon: Users, date: 'May 2026', size: '2.4 MB' },
           { title: 'Shift Performance', icon: TrendingUp, date: 'April 2026', size: '1.8 MB' },
           { title: 'Inventory Audit', icon: FileText, date: 'Q1 2026', size: '4.2 MB' },
           { title: 'Appointment Trends', icon: Calendar, date: 'Monthly', size: '840 KB' }
         ].map((report, i) => (
           <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 group cursor-pointer hover:border-primary/20 transition-all"
           >
              <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <report.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">{report.title}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{report.date} • {report.size}</p>
              
              <button className="mt-8 w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all">
                 <Download className="w-4 h-4" />
                 Download PDF
              </button>
           </motion.div>
         ))}
      </div>

      {/* Analytics Card Placeholder */}
      <div className="glass-card p-10 bg-primary/5 border-primary/10">
         <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Custom Report Generator</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Need a specific dataset? Use our advanced query builder to generate custom Excel or PDF reports based on date ranges, departments, or patient demographics.
            </p>
            <button className="mt-8 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
               Open Report Builder
            </button>
         </div>
      </div>
    </div>
  );
};

export default Reports;
