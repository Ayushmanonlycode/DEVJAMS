import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';


// Pages
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import Welcome from './pages/Welcome';

const routesConfig = [
  { path: "/", component: Welcome },
  { path: "/login", component: Login },
  { path: "/otp-verification", component: OTPVerification },
];

// AnimationLayout component uses useLocation which must be inside Router
const AnimationLayout = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routesConfig.map((route) => (
          <Route 
            key={route.path}
            path={route.path} 
            element={<route.component />} 
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="mobile-app">
        <AnimationLayout />
      </div>
    </Router>
  );
}

export default App;
