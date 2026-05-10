import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-24 p-8">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
