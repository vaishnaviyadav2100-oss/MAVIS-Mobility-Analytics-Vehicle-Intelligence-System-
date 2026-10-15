import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import MyVehicles from '../pages/customer/MyVehicles';
import AddVehicle from '../pages/customer/AddVehicle';
import BookService from '../pages/customer/BookService';
import MyBookings from '../pages/customer/MyBookings';
import ServiceHistory from '../pages/customer/ServiceHistory';
import MyInvoices from '../pages/customer/MyInvoices';
import AIAssistant from '../pages/customer/AIAssistant';

// Mechanic Pages
import MechanicDashboard from '../pages/mechanic/MechanicDashboard';
import AssignedJobs from '../pages/mechanic/AssignedJobs';
import JobDetails from '../pages/mechanic/JobDetails';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageVehicles from '../pages/admin/ManageVehicles';
import ManageBookings from '../pages/admin/ManageBookings';
import AssignJobs from '../pages/admin/AssignJobs';
import ManageMechanics from '../pages/admin/ManageMechanics';
import JobCards from '../pages/admin/JobCards';
import Invoices from '../pages/admin/Invoices';
import Analytics from '../pages/admin/Analytics';

export const AppRoutes = ({ currentView, setCurrentView }) => {
  const { isAuthenticated, role } = useAuth();
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [preFilledBooking, setPreFilledBooking] = useState(null);

  // If user is not logged in, show Auth
  if (!isAuthenticated) {
    if (currentView === 'register') {
      return (
        <Register
          onSwitchToLogin={() => setCurrentView('login')}
          onRegisterSuccess={(newUser) => {
            setCurrentView(
              newUser.role === 'ADMIN'
                ? 'admin-dashboard'
                : newUser.role === 'MECHANIC'
                ? 'mechanic-dashboard'
                : 'customer-dashboard'
            );
          }}
        />
      );
    }
    return (
      <Login
        onSwitchToRegister={() => setCurrentView('register')}
        onLoginSuccess={(loggedUser) => {
          setCurrentView(
            loggedUser.role === 'ADMIN'
              ? 'admin-dashboard'
              : loggedUser.role === 'MECHANIC'
              ? 'mechanic-dashboard'
              : 'customer-dashboard'
          );
        }}
      />
    );
  }

  // Customer Routes
  if (currentView === 'customer-dashboard') {
    return (
      <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
        <CustomerDashboard
          setCurrentView={setCurrentView}
          setSelectedVehicleForBooking={setSelectedVehicleForBooking}
        />
      </ProtectedRoute>
    );
  }

  if (currentView === 'customer-vehicles') {
    return (
      <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
        <MyVehicles
          setCurrentView={setCurrentView}
          setSelectedVehicleForBooking={setSelectedVehicleForBooking}
        />
      </ProtectedRoute>
    );
  }

  if (currentView === 'customer-add-vehicle') {
    return (
      <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
        <AddVehicle setCurrentView={setCurrentView} />
      </ProtectedRoute>
    );
  }

  if (currentView === 'customer-book-service') {
    return (
      <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
        <BookService
          setCurrentView={setCurrentView}
          initialVehicle={selectedVehicleForBooking}
          initialServiceType={preFilledBooking?.serviceType}
          initialDescription={preFilledBooking?.description}
        />
      </ProtectedRoute>
    );
  }

  if (currentView === 'customer-my-bookings') {
    return (
      <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
        <MyBookings setCurrentView={setCurrentView} />
      </ProtectedRoute>
    );
  }

  if (currentView === 'customer-history') {
    return (
      <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
        <ServiceHistory setCurrentView={setCurrentView} />
      </ProtectedRoute>
    );
  }

  if (currentView === 'customer-invoices') {
    return (
      <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
        <MyInvoices setCurrentView={setCurrentView} />
      </ProtectedRoute>
    );
  }

  if (currentView === 'customer-ai') {
    return (
      <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
        <AIAssistant
          setCurrentView={setCurrentView}
          setPreFilledBooking={setPreFilledBooking}
        />
      </ProtectedRoute>
    );
  }

  // Mechanic Routes
  if (currentView === 'mechanic-dashboard') {
    return (
      <ProtectedRoute allowedRoles={['MECHANIC', 'ADMIN']}>
        <MechanicDashboard
          setCurrentView={setCurrentView}
          setSelectedJob={setSelectedJob}
        />
      </ProtectedRoute>
    );
  }

  if (currentView === 'mechanic-jobs') {
    return (
      <ProtectedRoute allowedRoles={['MECHANIC', 'ADMIN']}>
        <AssignedJobs
          setCurrentView={setCurrentView}
          setSelectedJob={setSelectedJob}
        />
      </ProtectedRoute>
    );
  }

  if (currentView === 'mechanic-job-details') {
    return (
      <ProtectedRoute allowedRoles={['MECHANIC', 'ADMIN']}>
        <JobDetails job={selectedJob} setCurrentView={setCurrentView} />
      </ProtectedRoute>
    );
  }

  // Admin Routes
  if (currentView === 'admin-dashboard') {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminDashboard setCurrentView={setCurrentView} />
      </ProtectedRoute>
    );
  }

  if (currentView === 'admin-users') {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <ManageUsers />
      </ProtectedRoute>
    );
  }

  if (currentView === 'admin-vehicles') {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <ManageVehicles />
      </ProtectedRoute>
    );
  }

  if (currentView === 'admin-bookings') {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <ManageBookings />
      </ProtectedRoute>
    );
  }

  if (currentView === 'admin-assign-jobs') {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AssignJobs />
      </ProtectedRoute>
    );
  }

  if (currentView === 'admin-mechanics') {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <ManageMechanics />
      </ProtectedRoute>
    );
  }

  if (currentView === 'admin-jobcards') {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <JobCards setSelectedJob={setSelectedJob} setCurrentView={setCurrentView} />
      </ProtectedRoute>
    );
  }

  if (currentView === 'admin-invoices') {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <Invoices />
      </ProtectedRoute>
    );
  }

  if (currentView === 'admin-analytics') {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <Analytics />
      </ProtectedRoute>
    );
  }

  // Default fallback according to role
  if (role === 'ADMIN') return <AdminDashboard setCurrentView={setCurrentView} />;
  if (role === 'MECHANIC') return <MechanicDashboard setCurrentView={setCurrentView} setSelectedJob={setSelectedJob} />;
  return <CustomerDashboard setCurrentView={setCurrentView} setSelectedVehicleForBooking={setSelectedVehicleForBooking} />;
};

export default AppRoutes;
