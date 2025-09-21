import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import OTPVerification from './pages/OTPVerification';

// AnimationLayout component uses useLocation which must be inside Router
const AnimationLayout = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <Welcome />
            </PageTransition>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PageTransition>
              <Signup />
            </PageTransition>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          } 
        />
        <Route 
          path="/otp-verification" 
          element={
            <PageTransition>
              <OTPVerification />
            </PageTransition>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="mobile-app">
          <AnimationLayout />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
