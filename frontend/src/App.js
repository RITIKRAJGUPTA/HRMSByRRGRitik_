import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext.jsx';


// Lazy imports
const Login = React.lazy(() => import('./pages/Login.jsx'));
const Register = React.lazy(() => import('./pages/Register.jsx'));
const DashboardLayout = React.lazy(() => import('./pages/Dashboard.jsx')); // rename Dashboard to be Layout
const Candidates = React.lazy(() => import('./pages/Candidates.jsx'));
const Employees = React.lazy(() => import('./pages/Employees.jsx'));
const Attendance = React.lazy(() => import('./pages/Attendance.jsx'));
const Leaves = React.lazy(() => import('./pages/Leaves.jsx'));
const Logout = React.lazy(() => import('./pages/Logout.jsx'));

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="container py-5 text-center">Loading…</div>}>
        <Routes>
             {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={ <DashboardLayout />}>

          <Route index element={<Navigate to="candidates" replace />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="logout" element={<Logout />} />
        </Route>

       

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
