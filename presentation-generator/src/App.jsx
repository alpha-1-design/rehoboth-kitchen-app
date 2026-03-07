import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from './store/useStore';
import Onboarding from './components/Onboarding';
import Navigation from './components/Navigation';
import Home from './components/Home';
import CreatePresentation from './components/CreatePresentation';
import Settings from './components/Settings';

function App() {
  const { hasCompletedOnboarding, setOnboardingComplete, isDark } = useStore();
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={setOnboardingComplete} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'create':
        return <CreatePresentation />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen transition ${
        isDark
          ? 'bg-gray-950 text-white'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      {renderPage()}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </motion.div>
  );
}

export default App;
