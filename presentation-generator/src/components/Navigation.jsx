import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { getTranslation } from '../i18n/translations';
import { Home, Settings, Plus } from 'lucide-react';

const Navigation = ({ currentPage, onNavigate }) => {
  const { language, isDark, setIsDark } = useStore();
  const t = (key) => getTranslation(language, key);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg"
    >
      <div className="flex justify-around items-center h-20 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition ${
                isActive
                  ? 'text-primary bg-primary bg-opacity-10'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navigation;
