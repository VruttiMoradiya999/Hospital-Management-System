import React from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Messages = () => {
  return (
    <div className="h-[calc(100vh-120px)] flex gap-8">
      {/* Contact List */}
      <div className="w-80 glass-card flex flex-col">
        <div className="p-6 border-b border-gray-50">
           <h2 className="text-xl font-bold text-gray-800">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           {[
             { name: 'Dr. Sarah Wilson', lastMsg: 'The patient in room 157...', time: '2m' },
             { name: 'Nurse Joy', lastMsg: 'Vitals updated for John.', time: '1h' },
             { name: 'Admin', lastMsg: 'Monthly report is ready.', time: '3h' }
           ].map((contact, i) => (
             <div key={i} className="p-4 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gray-100 group">
                <div className="flex justify-between items-start mb-1">
                   <h4 className="font-bold text-gray-700 text-sm group-hover:text-primary">{contact.name}</h4>
                   <span className="text-[10px] font-bold text-gray-400">{contact.time}</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{contact.lastMsg}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Chat Area Placeholder */}
      <div className="flex-1 glass-card flex flex-col items-center justify-center text-center p-12">
         <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mb-6"
         >
            <MessageSquare className="w-10 h-10" />
         </motion.div>
         <h2 className="text-2xl font-bold text-gray-800">Internal Communication</h2>
         <p className="text-gray-400 max-w-sm mt-2 font-medium">
           Secure real-time messaging for hospital staff. Select a contact to start coordinating care.
         </p>
         <div className="mt-10 w-full max-w-lg relative">
            <input 
              disabled
              placeholder="Select a contact to send a message..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-lg opacity-50 cursor-not-allowed">
               <Send className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default Messages;
