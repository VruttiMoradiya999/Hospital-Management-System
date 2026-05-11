import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Mail, MessageSquare, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Poll for new messages
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchContacts = async () => {
    try {
      const res = await api.get('/users');
      setContacts(res.data.filter(u => u._id !== user?._id));
    } catch (error) {
      console.error("Error fetching contacts", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages?contactId=${selectedContact._id}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    try {
      const res = await api.post('/messages', {
        recipientId: selectedContact._id,
        content: newMessage
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-8">
      {/* Contact List */}
      <div className="w-80 glass-card flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-white">
           <h2 className="text-xl font-bold text-gray-800">Direct Messages</h2>
           <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">Hospital Staff</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50/30">
           {contacts.map((contact) => (
             <div 
              key={contact._id} 
              onClick={() => setSelectedContact(contact)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center gap-3 group ${selectedContact?._id === contact._id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-transparent hover:border-gray-100 hover:bg-gray-50'}`}
             >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${selectedContact?._id === contact._id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                   {contact.name[0]}
                </div>
                <div className="flex-1">
                   <h4 className="font-bold text-sm truncate">{contact.name}</h4>
                   <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedContact?._id === contact._id ? 'text-white/60' : 'text-gray-400'}`}>
                      {contact.role} • {contact.department || 'Staff'}
                   </p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card flex flex-col bg-white overflow-hidden relative">
        <AnimatePresence mode="wait">
          {selectedContact ? (
            <div 
              key={selectedContact._id}
              className="flex flex-col h-full"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-50 flex items-center gap-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                   {selectedContact.name[0]}
                </div>
                <div>
                   <h2 className="text-lg font-bold text-gray-800">{selectedContact.name}</h2>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Now</span>
                   </div>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((msg, i) => (
                  <div 
                    key={msg._id}
                    className={`flex ${msg.sender === user?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium shadow-sm ${msg.sender === user?._id ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-gray-700 rounded-bl-none'}`}>
                       {msg.content}
                       <div className={`text-[9px] mt-2 font-bold uppercase tracking-tighter opacity-50 ${msg.sender === user?._id ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-50 bg-white/50 backdrop-blur-md">
                <div className="relative">
                  <input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${selectedContact.name.split(' ')[0]}...`} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary/20 outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
                  >
                     <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
               <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mb-6 animate-bounce">
                  <MessageSquare className="w-10 h-10" />
               </div>
               <h2 className="text-2xl font-bold text-gray-800">Staff Communications</h2>
               <p className="text-gray-400 max-w-sm mt-2 font-medium">
                 Select a colleague from the list to start a secure conversation. All messages are encrypted and stored for audit.
               </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Messages;
