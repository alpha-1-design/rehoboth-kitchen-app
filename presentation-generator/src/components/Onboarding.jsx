import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { getTranslation } from '../i18n/translations';
import { Sparkles, Camera, Zap, Globe } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { language, setLanguage, setLocation } = useStore();
  const t = (key) => getTranslation(language, key);

  const steps = [
    {
      title: t('welcome'),
      subtitle: t('subtitle'),
      icon: Sparkles,
    },
    {
      title: t('language'),
      subtitle: 'Choose your preferred language',
      options: ['en', 'es', 'fr'],
    },
    {
      title: t('location'),
      subtitle: t('allowLocation'),
      action: 'location',
    },
  ];

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setStep(step + 1);
  };

  const handleLocationAccess = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (error) {
      console.warn('Location access denied');
    }
    setStep(step + 1);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[step];
  const Icon = currentStep.icon || Camera;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6 flex justify-center"
          >
            <Icon className="w-16 h-16 text-primary" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {currentStep.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {currentStep.subtitle}
          </p>

          {currentStep.options && (
            <div className="space-y-3 mb-8">
              {currentStep.options.map((lang) => (
                <motion.button
                  key={lang}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLanguageSelect(lang)}
                  className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition"
                >
                  {lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Français'}
                </motion.button>
              ))}
            </div>
          )}

          {currentStep.action === 'location' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLocationAccess}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition mb-4 flex items-center justify-center gap-2"
            >
              <Globe className="w-5 h-5" />
              {t('allowLocation')}
            </motion.button>
          )}

          <div className="flex gap-4">
            {step > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step - 1)}
                className="flex-1 py-2 px-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition"
              >
                {t('back')}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex-1 py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              {step === steps.length - 1 ? t('done') : t('next')}
            </motion.button>
          </div>

          <div className="mt-6 flex gap-2 justify-center">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                className={`h-2 rounded-full ${i <= step ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                animate={{ width: i <= step ? 24 : 8 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
