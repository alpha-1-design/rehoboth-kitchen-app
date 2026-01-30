import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: '#1a1a1a', // Dark Black/Grey
      color: '#ffffff',
      padding: '30px 20px',
      marginTop: 'auto', // Pushes to bottom
      fontFamily: 'sans-serif',
      fontSize: '14px',
      textAlign: 'center'
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      maxWidth: '800px',
      margin: '0 auto 20px auto',
      gap: '20px'
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      textAlign: 'left'
    },
    title: {
      color: '#2C5530', // Rehoboth Green
      fontWeight: 'bold',
      fontSize: '16px',
      marginBottom: '10px'
    },
    link: {
      color: '#ccc',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    copyright: {
      borderTop: '1px solid #333',
      paddingTop: '20px',
      color: '#777',
      fontSize: '12px'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.row}>
        <div style={styles.column}>
          <div style={styles.title}>Rehoboth Kitchen</div>
          <span>Culinary Excellence, Delivered.</span>
          <span>Accra, Ghana</span>
          <span>+233 20 015 9500</span>
        </div>
        
        <div style={styles.column}>
          <div style={styles.title}>Shop Categories</div>
          <span>Electronics</span>
          <span>Home Appliances</span>
          <span>Kitchen Appliances</span>
        </div>

        <div style={styles.column}>
          <div style={styles.title}>Customer Service</div>
          <span>Contact Us</span>
          <span>Delivery Info</span>
          <span>Return Policy</span>
        </div>
      </div>

      <div style={styles.copyright}>
        &copy; {new Date().getFullYear()} Rehoboth Kitchen Ventures. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
