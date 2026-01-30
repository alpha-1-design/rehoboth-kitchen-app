import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  // POINTS TO YOUR LOCAL FILE
  const VIDEO_URL = "/intro.mp4"; 

  const handleVideoEnd = () => {
    setFadeOut(true);
    setTimeout(onComplete, 800); 
  };

  const styles = {
    container: {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'black', zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.8s ease-in-out',
      pointerEvents: fadeOut ? 'none' : 'auto'
    },
    video: {
      width: '100%', height: '100%', objectFit: 'cover'
    },
    btn: {
      position: 'absolute', bottom: '50px',
      padding: '10px 25px', borderRadius: '30px',
      background: 'rgba(255,255,255,0.2)', border: '1px solid white',
      color: 'white', fontWeight: 'bold', backdropFilter: 'blur(5px)',
      cursor: 'pointer', zIndex: 100000
    }
  };

  return (
    <div style={styles.container}>
      <video 
        autoPlay 
        muted 
        playsInline
        onEnded={handleVideoEnd}
        style={styles.video}
        src={VIDEO_URL}
      />
      <button onClick={handleVideoEnd} style={styles.btn}>Skip Intro ›</button>
    </div>
  );
};

export default SplashScreen;
