import React from 'react';

const Icon = ({ name, size = 24, color = "currentColor" }) => {
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>,
    cart: <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-7-2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2zm-5-14h2l1.68 10.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L22 6H6"></path>,
    user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>,
    userHead: <circle cx="12" cy="7" r="4"></circle>,
    dashboard: <rect x="3" y="3" width="7" height="7"></rect>,
    dashboard2: <rect x="14" y="3" width="7" height="7"></rect>,
    dashboard3: <rect x="14" y="14" width="7" height="7"></rect>,
    dashboard4: <rect x="3" y="14" width="7" height="7"></rect>,
    bell: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>,
    bellClapper: <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>,
    bulb: <path d="M9 18h6"></path>,
    bulb2: <path d="M10 22h4"></path>,
    bulb3: <path d="M12 2a7 7 0 0 0-7 7c0 2 0 3 2 4.5V17a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3.5c2-1.5 2-2.5 2-4.5a7 7 0 0 0-7-7z"></path>,
    support: <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>,
    support2: <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>,
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>,
    logoutArrow: <polyline points="16 17 21 12 16 7"></polyline>,
    logoutLine: <line x1="21" y1="12" x2="9" y2="12"></line>,
    arrowRight: <polyline points="9 18 15 12 9 6"></polyline>,
    search: <circle cx="11" cy="11" r="8"></circle>,
    searchLine: <line x1="21" y1="21" x2="16.65" y2="16.65"></line>,
    // NEW MIC ICON
    mic: <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>,
    micBase: <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>,
    micStand: <line x1="12" y1="19" x2="12" y2="23"></line>,
    micLine: <line x1="8" y1="23" x2="16" y2="23"></line>
  };

  const selected = icons[name];
  if (!selected) return null;

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {selected}
      {name === 'user' && icons.userHead}
      {name === 'dashboard' && <>{icons.dashboard2}{icons.dashboard3}{icons.dashboard4}</>}
      {name === 'bell' && icons.bellClapper}
      {name === 'bulb' && <>{icons.bulb2}{icons.bulb3}</>}
      {name === 'support' && icons.support2}
      {name === 'logout' && <>{icons.logoutArrow}{icons.logoutLine}</>}
      {name === 'search' && icons.searchLine}
      {name === 'mic' && <>{icons.micBase}{icons.micStand}{icons.micLine}</>}
    </svg>
  );
};

export default Icon;
