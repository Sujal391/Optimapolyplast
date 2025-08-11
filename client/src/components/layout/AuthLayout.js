import React from 'react';
// import Sidebar from './sidebar';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* <Sidebar /> */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
// AuthLayout.js



