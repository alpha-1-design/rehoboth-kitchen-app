import React, { useEffect, useState } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isApp, setIsApp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsApp(true);
      return;
    }

    // Detect iPhone/iPad
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
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
      alert("To install:\n1. Tap the browser menu (3 dots)\n2. Tap \'Install App\' or \'Add to Home Screen\'");
    }
  };

  const btnStyle = {
    background: '#2C5530', color: 'white', padding: '15px',
    borderRadius: '10px', marginTop: '15px', width: '100%',
    border: 'none', fontWeight: 'bold', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer'
  };

  const overlayStyle = {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: 'white', borderRadius: '20px 20px 0 0',
    padding: '25px 20px', boxShadow: '0 -5px 30px rgba(0,0,0,0.2)',
    zIndex: 9999
  };

  if (isApp) return null;

  return (
    <>
      <button onClick={handleInstall} style={btnStyle}>
        📲 Install App on Phone
      </button>

      {showIOSGuide && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:9998}} onClick={() => setShowIOSGuide(false)}>
          <div style={overlayStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{color:'#2C5530', margin:'0 0 15px 0', textAlign:'center'}}>Install Rehoboth Kitchen</h3>
            
            <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'15px', padding:'15px', background:'#f9f9f9', borderRadius:'10px'}}>
              <span style={{fontSize:'30px'}}>1️⃣</span>
              <div>
                <strong>Tap the Share button</strong>
                <p style={{margin:'5px 0 0 0', fontSize:'13px', color:'#666'}}>Tap the 
                  <span style={{display:'inline-block', margin:'0 5px', padding:'2px 8px', background:'#007AFF', color:'white', borderRadius:'5px', fontSize:'12px'}}>⬆️ Share</span>
                  button at the bottom of Safari
                </p>
              </div>
            </div>

            <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'15px', padding:'15px', background:'#f9f9f9', borderRadius:'10px'}}>
              <span style={{fontSize:'30px'}}>2️⃣</span>
              <div>
                <strong>Add to Home Screen</strong>
                <p style={{margin:'5px 0 0 0', fontSize:'13px', color:'#666'}}>Scroll down and tap <strong>"Add to Home Screen"</strong></p>
              </div>
            </div>

            <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px', padding:'15px', background:'#f9f9f9', borderRadius:'10px'}}>
              <span style={{fontSize:'30px'}}>3️⃣</span>
              <div>
                <strong>Tap Add</strong>
                <p style={{margin:'5px 0 0 0', fontSize:'13px', color:'#666'}}>Tap <strong>"Add"</strong> in the top right corner</p>
              </div>
            </div>

            <button onClick={() => setShowIOSGuide(false)} style={{...btnStyle, marginTop:0}}>Got it!</button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPrompt;
