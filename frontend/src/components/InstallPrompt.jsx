import React, { useEffect, useState } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    // 1. Check if running in "App Mode" (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsApp(true);
    }

    // 2. Listen for the install prompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.warn('App installed successfully');
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.warn('Installation error');
      }
    } else {
      alert("To install:\n1. Tap the browser menu (3 dots)\n2. Tap 'Install App' or 'Add to Home Screen'");
    }
  };

  const style = {
    background: '#2C5530', color: 'white', padding: '15px',
    borderRadius: '10px', marginTop: '15px', width: '100%',
    border: 'none', fontWeight: 'bold', display: 'flex', 
    alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer'
  };

  if (isApp) return null;

  return (
    <button onClick={handleInstall} style={style}>
      📲 Install App on Phone
    </button>
  );
};

export default InstallPrompt;
