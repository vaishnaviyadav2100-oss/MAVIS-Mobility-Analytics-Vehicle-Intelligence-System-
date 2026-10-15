import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';

function MainLayout() {
  const { isAuthenticated, role } = useAuth();
  const [currentView, setCurrentView] = useState('customer-dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {isAuthenticated && (
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AppRoutes currentView={currentView} setCurrentView={setCurrentView} />
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
