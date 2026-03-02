import { useToast } from '../components/Toast';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/apiService';

const Checkout = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', note: '' });
  const [loading, setLoading] = useState(false);

  const [cart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone) {
      toast('Please fill in your Delivery Details', "warning");
      return;
    }

    setLoading(true);

    const orderData = {
      customer: formData,
      items: cart,
      totalAmount: total,
      date: new Date().toISOString()
    };

    try {
      await orderAPI.create(orderData);
      localStorage.removeItem('cart');
      navigate('/success');
    } catch (err) {
      console.warn('Order failed');
      toast('Something went wrong. Please try again.', "warning");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ddd', background: '#fff', fontSize: '16px' };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px', minHeight: '100vh', background: '#f5f5f5' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', fontSize: '24px', marginBottom: '10px' }}>←</button>

      <h2 style={{ color: '#275228', marginBottom: '5px' }}>Checkout</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Complete your order</p>

      <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <strong>Order Summary</strong> <br/>
          {cart.map((item, index) => (
            <div key={index} style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>• {item.name}</div>
          ))}
          <div style={{ marginTop: '15px', fontSize: '18px', fontWeight: 'bold' }}>
            Total: <span style={{ color: '#275228' }}>₵{total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <label>Full Name</label>
          <input name="name" style={inputStyle} placeholder="Eg. Kofi Mensah" value={formData.name} onChange={handleChange} required />

          <label>Phone Number</label>
          <input name="phone" type="tel" style={inputStyle} placeholder="Eg. 024xxxxxxx" value={formData.phone} onChange={handleChange} required />

          <label>Delivery Address</label>
          <textarea name="address" style={{ ...inputStyle, height: '80px' }} placeholder="Eg. Accra, Circle, near the shell filling station" value={formData.address} onChange={handleChange} required />

          <label>Note (Optional)</label>
          <input name="note" style={inputStyle} placeholder="Any special instructions?" value={formData.note} onChange={handleChange} />

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '18px', background: '#275228', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
