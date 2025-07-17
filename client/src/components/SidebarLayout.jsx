import React from 'react';
import Navbar from './Navbar';

const SidebarLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-56 bg-gray-100 border-r p-4">
          <div className="font-bold text-lg mb-6">HRMS</div>
          <nav className="flex flex-col gap-2">
            {/* Sidebar links can be added here if needed */}
          </nav>
        </aside>
        <main className="flex-1 p-4 sm:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
