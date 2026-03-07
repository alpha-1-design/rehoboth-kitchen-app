import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { getTranslation } from '../i18n/translations';
import { Camera, Upload, Zap } from 'lucide-react';
import { extractText, detectObjects, detectFaces } from '../services/ai';
import { summarizeText, generateSlides } from '../services/api';

const CreatePresentation = () => {
  const { language, addPresentation } = useStore();
  const t = (key) => getTranslation(language, key);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cameraRef = useRef(null);
  const fileInputRef = useRef(null);

  const modes = [
    { id: 'text', label: t('textToSlides'), icon: '📄' },
    { id: 'object', label: t('objectDetection'), icon: '🔍' },
    { id: 'face', label: t('faceRecognition'), icon: '👤' },
    { id: 'product', label: t('productSearch'), icon: '🛍️' },
  ];

  const handleCapture = async (imageData) => {
    setLoading(true);
    setProgress(0);

    try {
      let content = {};

      if (mode === 'text') {
        setProgress(33);
        const text = await extractText(imageData);
        setProgress(66);
        const summary = await summarizeText(text);
        content = { type: 'text', data: summary };
      } else if (mode === 'object') {
        setProgress(33);
        const objects = await detectObjects(imageData);
        setProgress(66);
        const slides = await generateSlides(objects, 'object');
        content = { type: 'object', data: slides };
      } else if (mode === 'face') {
        setProgress(33);
        const faces = await detectFaces(imageData);
        setProgress(66);
        content = { type: 'face', data: faces };
      }

      setProgress(100);

      const presentation = {
        id: Date.now(),
        title: `Presentation ${new Date().toLocaleDateString()}`,
        content,
        createdAt: new Date(),
      };

      addPresentation(presentation);
      setMode(null);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mode) {
    return (
      <div className="p-4 pb-24">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {t('getStarted')}
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {modes.map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(m.id)}
              className="p-6 bg-gradient-to-br from-primary to-secondary rounded-xl text-white shadow-lg hover:shadow-xl transition"
            >
              <div className="text-4xl mb-2">{m.icon}</div>
              <p className="font-semibold text-sm">{m.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMode(null)}
        className="mb-4 text-primary font-semibold"
      >
        ← {t('back')}
      </motion.button>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400 mb-2">{t('processing')}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition"
          >
            <Camera className="w-5 h-5" />
            {t('camera')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-4 bg-secondary text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition"
          >
            <Upload className="w-5 h-5" />
            {t('gallery')}
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  handleCapture(event.target?.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default CreatePresentation;
