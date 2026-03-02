import { useToast } from '../components/Toast';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/apiService';

const Cart = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState({ name: '', email: '', phone: '', location: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  useEffect(() => {
    // 1. Load Cart
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
    calculateTotal(storedCart);

    // 2. Load User Info & Smart Auto-fill
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) {
      setDetails({ 
        name: user.name, 
        email: user.email || '', 
        phone: user.phone || '', 
        location: user.ghanaPost || '' 
      });

      if (user.momoNumber) {
        setPaymentMethod('Mobile Money');
      }

      if(user.email === 'gracee14gn@gmail.com') setIsAdmin(true);
    }
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price, 0);
    setTotal(sum);
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    calculateTotal(newCart);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    
    try {
      await orderAPI.create({
        customerName: details.name,
        email: details.email,
        phone: details.phone,
        location: details.location,
        paymentMethod: paymentMethod,
        items: cart,
        total: total
      });
      localStorage.removeItem('cart');
      navigate('/success');
    } catch (err) {
      console.warn('Order failed');
      toast('Order failed. Please try again.', "warning");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', minHeight: '100vh', background: '#f9f9f9', paddingBottom: '100px' },
    header: { color: '#2C5530', borderBottom: '2px solid #ddd', paddingBottom: '10px' },
    item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px', marginBottom: '10px', borderRadius: '10px' },
    removeBtn: { color: 'red', background: 'none', border: 'none', fontWeight: 'bold' },
    footer: { marginTop: '30px', background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 -5px 20px rgba(0,0,0,0.05)' },
    checkoutBtn: { width: '100%', padding: '15px', background: '#2C5530', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', marginTop: '15px' },
    input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' },
    label: { fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' },
    radioGroup: { display: 'flex', gap: '15px', marginBottom: '15px' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '5px', background: '#f0f0f0', padding: '10px', borderRadius: '8px', flex: 1, cursor: 'pointer' }
  };

  if (isAdmin) {
    return <div style={{padding:'20px', textAlign:'center'}}>Admin View: Go to Dashboard</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Shopping Cart ({cart.length})</h2>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#777' }}>
          <p>Your cart is empty.</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', background: '#2C5530', color: 'white', border: 'none', borderRadius: '5px' }}>Start Shopping</button>
        </div>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index} style={styles.item}>
              <div>
                <strong style={{ display: 'block' }}>{item.name}</strong>
                <span style={{ color: '#2C5530' }}>GHS {item.price}</span>
              </div>
              <button onClick={() => removeItem(index)} style={styles.removeBtn}>Remove</button>
            </div>
          ))}

          <div style={styles.footer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px' }}>
              <strong>Total:</strong>
              <strong style={{ color: '#2C5530' }}>GHS {total}</strong>
            </div>

            {!showForm ? (
              <button onClick={() => setShowForm(true)} style={styles.checkoutBtn}>
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handlePlaceOrder} style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <h3 style={{marginBottom:'15px', color:'#2C5530'}}>Delivery Details</h3>

                <label style={styles.label}>Full Name</label>
                <input required value={details.name} onChange={e => setDetails({...details, name: e.target.value})} style={styles.input} />

                <label style={styles.label}>Email Address</label>
                <input required type="email" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} style={styles.input} placeholder="you@example.com" />

                <label style={styles.label}>Phone Number</label>
                <input required type="tel" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} style={styles.input} />

                <label style={styles.label}>Delivery Location (GhanaPost / Landmark)</label>
                <input required value={details.location} onChange={e => setDetails({...details, location: e.target.value})} style={styles.input} placeholder="e.g. GA-123-4567" />

                <h3 style={{marginTop:'20px', marginBottom:'10px', color:'#2C5530'}}>Payment</h3>
                <div style={styles.radioGroup}>
                  <label style={{...styles.radioLabel, border: paymentMethod === 'Cash on Delivery' ? '2px solid #2C5530' : 'none'}}>
                    <input type="radio" name="pay" checked={paymentMethod === 'Cash on Delivery'} onChange={() => setPaymentMethod('Cash on Delivery')} /> Cash
                  </label>
                  <label style={{...styles.radioLabel, border: paymentMethod === 'Mobile Money' ? '2px solid #2C5530' : 'none'}}>
                    <input type="radio" name="pay" checked={paymentMethod === 'Mobile Money'} onChange={() => setPaymentMethod('Mobile Money')} /> Momo
                  </label>
                </div>
                <button type="submit" style={styles.checkoutBtn} disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm Order'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
