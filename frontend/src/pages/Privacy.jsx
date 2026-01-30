import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ padding: '20px', paddingBottom: '80px', background: 'white', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', fontSize: '24px', marginBottom: '10px' }}>←</button>
      
      <h1 style={{ color: '#275228', marginBottom: '10px' }}>Privacy Policy</h1>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>Last Updated: December 2025</p>

      <div style={{ lineHeight: '1.6' }}>
        <h3 style={{ color: '#275228', marginTop: '20px' }}>1. Introduction</h3>
        <p>Welcome to Rehoboth. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our application and tell you about your privacy rights.</p>

        <h3 style={{ color: '#275228', marginTop: '20px' }}>2. Data We Collect</h3>
        <p>We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together follows:</p>
        <ul style={{ paddingLeft: '20px', color: '#555' }}>
          <li><strong>Identity Data:</strong> Name, username.</li>
          <li><strong>Contact Data:</strong> Email address, telephone number, delivery address.</li>
          <li><strong>Transaction Data:</strong> Details about payments and products you have purchased from us.</li>
        </ul>

        <h3 style={{ color: '#275228', marginTop: '20px' }}>3. How We Use Your Data</h3>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul>
          <li>To register you as a new customer.</li>
          <li>To process and deliver your order.</li>
          <li>To manage our relationship with you (Customer Support).</li>
        </ul>

        <h3 style={{ color: '#275228', marginTop: '20px' }}>4. Data Security</h3>
        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. Access to your personal data is limited to employees/admins who have a business need to know.</p>

        <h3 style={{ color: '#275228', marginTop: '20px' }}>5. Contact Us</h3>
        <p>If you have any questions about this privacy policy, please contact us at <strong>gracee14gn@gmail.com</strong>.</p>
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'center', padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>© 2025 Rehoboth General Merchants. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Privacy;
