import { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1200);
    const t3 = setTimeout(() => setStep(3), 2000);
    const t4 = setTimeout(() => onFinish(), 3000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#2C5530',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        transform: step >= 1 ? 'scale(1)' : 'scale(0.5)',
        opacity: step >= 1 ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        marginBottom: '20px'
      }}>
        <img src="/logo.png" alt="Rehoboth Kitchen" style={{ width: '100px', height: '100px', borderRadius: '20px' }} />
      </div>

      <div style={{
        opacity: step >= 2 ? 1 : 0,
        transform: step >= 2 ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', fontFamily: 'serif' }}>
          Rehoboth Kitchen
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>
          Culinary Excellence
        </p>
      </div>

      <div style={{
        opacity: step >= 3 ? 1 : 0,
        transition: 'all 0.5s ease',
        marginTop: '40px',
        display: 'flex', gap: '8px'
      }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            animation: `pulse 1s ease-in-out ${i * 0.2}s infinite alternate`
          }} />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          from { opacity: 0.3; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
