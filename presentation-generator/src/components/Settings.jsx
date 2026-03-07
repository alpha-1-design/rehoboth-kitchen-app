import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { getTranslation } from '../i18n/translations';
import { Moon, Sun, Globe } from 'lucide-react';

const Settings = () => {
  const { language, setLanguage, isDark, setIsDark } = useStore();
  const t = (key) => getTranslation(language, key);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];

  return (
    <div className="p-4 pb-24">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('settings')}
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="w-5 h-5 text-primary" />
            ) : (
              <Sun className="w-5 h-5 text-primary" />
            )}
            <span className="font-semibold text-gray-900 dark:text-white">
              {t('theme')}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDark(!isDark)}
            className={`relative w-14 h-8 rounded-full transition ${
              isDark ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <motion.div
              className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full"
              animate={{ x: isDark ? 24 : 0 }}
            />
          </motion.button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isDark ? t('darkMode') : t('lightMode')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md"
      >
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <span className="font-semibold text-gray-900 dark:text-white">
            {t('language')}
          </span>
        </div>
        <div className="space-y-2">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLanguage(lang.code)}
              className={`w-full p-3 rounded-lg font-semibold transition ${
                language === lang.code
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {lang.name}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
