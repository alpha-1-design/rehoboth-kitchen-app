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
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        setDeferredPrompt(null);
      });
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

  // If already installed (App Mode), HIDE the button completely
  if (isApp) return null;

  return (
    <button onClick={handleInstall} style={style}>
      📲 Install App on Phone
    </button>
  );
};

export default InstallPrompt;
