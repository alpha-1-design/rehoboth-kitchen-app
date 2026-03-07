import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { getTranslation } from '../i18n/translations';
import { Download, Share2, Trash2 } from 'lucide-react';
import { downloadPresentation } from '../services/slideGenerator';

const Home = () => {
  const { language, presentations, deletePresentation } = useStore();
  const t = (key) => getTranslation(language, key);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('welcome')}
      </h1>

      {presentations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No presentations yet. Create one to get started!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {presentations.map((presentation) => (
            <motion.div
              key={presentation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {presentation.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {new Date(presentation.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 px-3 bg-primary text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition"
                >
                  <Download className="w-4 h-4" />
                  {t('download')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 px-3 bg-secondary text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition"
                >
                  <Share2 className="w-4 h-4" />
                  {t('share')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deletePresentation(presentation.id)}
                  className="py-2 px-3 bg-red-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
