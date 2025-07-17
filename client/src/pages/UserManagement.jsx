import React, { useState } from 'react';
import RegisterUserModal from '../components/RegisterUserModal';
import useAuth from '../components/useAuth';

const UserManagement = () => {
  const { user } = useAuth();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <div className="p-4 sm:p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">User Management</h1>
      {user?.role === 'admin' && (
        <button
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold w-full sm:w-auto"
          onClick={() => setShowRegisterModal(true)}
        >
          Register New User
        </button>
      )}
      <RegisterUserModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onUserRegistered={() => setShowRegisterModal(false)}
      />
      {/* You can add a user list/table here later */}
    </div>
  );
};

export default UserManagement;
