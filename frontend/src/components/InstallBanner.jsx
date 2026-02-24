import React, { useEffect, useState } from 'react';

const InstallBanner = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Don't show if already installed or dismissed
    const dismissed = localStorage.getItem('installBannerDismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (dismissed || isStandalone) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    if (ios) {
      setTimeout(() => setShow(true), 2000);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShow(true), 2000);
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
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShow(false);
        localStorage.setItem('installBannerDismissed', 'true');
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  if (!show) return null;

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: '#2C5530', color: 'white',
        padding: '12px 15px', display: 'flex', alignItems: 'center',
        gap: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        animation: 'slideDown 0.4s ease'
      }}>
        <style>{`@keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }`}</style>
        <img src="/logo.png" style={{width:'40px', height:'40px', borderRadius:'8px'}} alt="logo" />
        <div style={{flex:1}}>
          <div style={{fontWeight:'bold', fontSize:'14px'}}>Rehoboth Kitchen</div>
          <div style={{fontSize:'12px', opacity:0.85}}>Add to home screen for the best experience!</div>
        </div>
        <button onClick={handleInstall} style={{
          background: 'white', color: '#2C5530', border: 'none',
          padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold',
          fontSize: '13px', cursor: 'pointer'
        }}>Install</button>
        <button onClick={handleDismiss} style={{
          background: 'none', border: 'none', color: 'white',
          fontSize: '20px', cursor: 'pointer', padding: '0 5px'
        }}>×</button>
      </div>

      {showIOSGuide && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:10000}} onClick={() => setShowIOSGuide(false)}>
          <div style={{position:'fixed', bottom:0, left:0, right:0, background:'white', borderRadius:'20px 20px 0 0', padding:'25px 20px', boxShadow:'0 -5px 30px rgba(0,0,0,0.2)'}} onClick={e => e.stopPropagation()}>
            <h3 style={{color:'#2C5530', margin:'0 0 15px 0', textAlign:'center'}}>Install Rehoboth Kitchen</h3>

            <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'15px', padding:'15px', background:'#f9f9f9', borderRadius:'10px'}}>
              <span style={{fontSize:'30px'}}>1️⃣</span>
              <div>
                <strong>Tap the Share button</strong>
                <p style={{margin:'5px 0 0 0', fontSize:'13px', color:'#666'}}>Tap the <span style={{display:'inline-block', margin:'0 5px', padding:'2px 8px', background:'#007AFF', color:'white', borderRadius:'5px', fontSize:'12px'}}>⬆️ Share</span> button at the bottom of Safari</p>
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

            <button onClick={() => { setShowIOSGuide(false); handleDismiss(); }} style={{width:'100%', padding:'15px', background:'#2C5530', color:'white', border:'none', borderRadius:'10px', fontWeight:'bold', cursor:'pointer'}}>Got it!</button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallBanner;
