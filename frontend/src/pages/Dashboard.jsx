import { useToast } from '../components/Toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, orderAPI, bannerAPI, supportAPI } from '../services/apiService';

const Dashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) navigate('/');
    else setUser(JSON.parse(storedUser));
    fetchData();
  }, [navigate]);


  const fetchData = async () => {
    try {
      const [resProd, resOrd, resBan, resMsg, resUsers] = await Promise.all([
        productAPI.getAll(),
        orderAPI.getAll(),
        bannerAPI.getAll(),
        supportAPI.getMessages(),
        fetch((import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com') + '/api/auth/users', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }).then(r => r.json())
      ]);
      setProducts(resProd);
      setOrders(resOrd.reverse());
      setBanners(resBan);
      setMessages(resMsg.reverse());
      setUsers(Array.isArray(resUsers) ? resUsers : []);
    } catch (err) {
      console.warn('Failed to fetch data');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleReply = async (id) => {
    const reply = prompt("Enter your reply:");
    if (reply) {
      try {
        await supportAPI.replyToMessage(id, reply);
        toast("Reply sent!", "success");
        fetchData();
      } catch (err) {
        toast('Failed to send reply', "error");
      }
    }
  };

  const handleDeleteMessage = async (id) => {
    if (confirm('Delete this message?')) {
      try {
        await supportAPI.deleteMessage(id);
        fetchData();
      } catch (err) {
        toast('Failed to delete message', "error");
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Delete item?')) {
      try {
        await productAPI.delete(id);
        fetchData();
      } catch (err) {
        toast('Failed to delete product', "error");
      }
    }
  };

  const handleDeleteBanner = async (id) => {
    if (confirm('Delete Banner?')) {
      try {
        await bannerAPI.delete(id);
        fetchData();
      } catch (err) {
        toast('Failed to delete banner', "error");
      }
    }
  };

  const markDelivered = async (id) => {
    if (confirm('Mark Delivered?')) {
      try {
        await orderAPI.update(id, { status: 'Delivered' });
        fetchData();
      } catch (err) {
        toast('Failed to update status', "error");
      }
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const API_BASE_URL = 'https://rehoboth-backend.onrender.com';
    return `${API_BASE_URL}${imagePath}`;
  };

  if (!user) return <div>Loading...</div>;

  const styles = {
    container: { padding: '20px', fontFamily: 'sans-serif', background: '#f4f4f4', minHeight: '100vh', paddingBottom: '80px' },
    tabBar: { display: 'flex', marginBottom: '20px', background: 'white', padding: '5px', borderRadius: '10px', overflowX: 'auto' },
    tab: (active) => ({ flex: 1, padding: '10px', border: 'none', background: active ? '#2C5530' : 'transparent', color: active ? 'white' : '#555', borderRadius: '8px', fontWeight: 'bold', minWidth: '80px' }),
    card: { background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    status: (status) => ({ float: 'right', padding: '4px 8px', borderRadius: '5px', fontSize: '12px', background: status === 'Pending' ? '#fff3cd' : '#d4edda', color: status === 'Pending' ? '#856404' : '#155724' }),
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2C5530', margin: 0 }}>Admin Panel</h2>
        <button onClick={handleLogout} style={{ background: '#c0392b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px' }}>Logout</button>
      </div>

      <div style={styles.tabBar}>
        <button onClick={() => setActiveTab('orders')} style={styles.tab(activeTab === 'orders')}>Orders</button>
        <button onClick={() => setActiveTab('inventory')} style={styles.tab(activeTab === 'inventory')}>Inventory</button>
        <button onClick={() => setActiveTab('support')} style={styles.tab(activeTab === 'support')}>Support</button>
        <button onClick={async () => {
          setActiveTab('users');
          const BASE_URL = import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com';
          const res = await fetch(BASE_URL + '/api/auth/users', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : []);
        }} style={styles.tab(activeTab === 'users')}>Users</button>
      </div>

      {activeTab === 'orders' && (
        <div>
          {orders.map((order) => (
            <div key={order._id} style={styles.card}>
              <span style={styles.status(order.status)}>{order.status}</span>
              <h4>{order.customerName}</h4>
              <p>📞 {order.phone} | 📍 {order.location}</p>
              <div style={{background:'#f9f9f9', padding:'10px', fontSize:'13px'}}>
                {order.items.map((i, idx) => <div key={idx}>• {i.name}</div>)}
                <div style={{marginTop:'5px', fontWeight:'bold'}}>Total: GHS {order.total} | {order.paymentMethod}</div>
              </div>
              <div style={{marginTop:'10px', display:'flex', gap:'8px'}}>
                <select onChange={(e) => updateStatus(order._id, e.target.value)} defaultValue={order.status} style={{flex:1, padding:'8px', borderRadius:'5px', border:'1px solid #ddd', fontSize:'13px'}}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button onClick={() => sendWhatsAppReceipt(order)} style={{padding:'8px 12px', background:'#25D366', color:'white', border:'none', borderRadius:'5px', fontSize:'13px', cursor:'pointer', whiteSpace:'nowrap'}}>📲 Receipt</button>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p style={{textAlign:'center'}}>No orders.</p>}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div>
          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
            <button onClick={() => navigate('/add-product')} style={{ padding: '15px', background: '#2C5530', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Product</button>
            <button onClick={() => navigate('/add-banner')} style={{ padding: '15px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>+ Banner</button>
          </div>

          <h4 style={{marginBottom:'10px'}}>Banners</h4>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
            {banners.map((item) => (
              <div key={item._id} style={{ minWidth: '120px', background: 'white', padding: '5px', borderRadius: '8px' }}>
                <img src={getImageUrl(item.image)} style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                <button onClick={() => handleDeleteBanner(item._id)} style={{ width: '100%', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px', padding: '5px', marginTop:'5px' }}>Delete</button>
              </div>
            ))}
          </div>

          <h4 style={{marginBottom:'10px'}}>Products</h4>
          {products.map((item) => (
            <div key={item._id} style={styles.card}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <strong>{item.name}</strong>
                <button onClick={() => handleDeleteProduct(item._id)} style={{ color: 'red', background: 'none', border: 'none' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
            <h4 style={{margin:0}}>All Users ({users.length})</h4>
            <button onClick={async () => {
              try {
              const BASE_URL = import.meta.env.VITE_API_URL || 'https://rehoboth-backend.onrender.com';
              const res = await fetch(BASE_URL + '/api/auth/fix-referrals', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              const data = await res.json();
              toast(data.message, "error");
              fetchData();
              } catch(err) { toast('Error: ' + err.message, "error"); }
            }} style={{background:'#2C5530', color:'white', border:'none', padding:'8px 12px', borderRadius:'8px', fontSize:'12px'}}>
              Fix Referral Codes
            </button>
          </div>
          {users.map((u) => (
            <div key={u._id} style={styles.card}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <strong>{u.name}</strong>
                  <p style={{margin:'3px 0', fontSize:'12px', color:'#666'}}>{u.email}</p>
                  <p style={{margin:'3px 0', fontSize:'12px', color:'#666'}}>{u.phone}</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <span style={{fontSize:'12px', background: u.isAdmin ? '#2C5530' : '#eee', color: u.isAdmin ? 'white' : '#333', padding:'3px 8px', borderRadius:'10px'}}>{u.isAdmin ? 'Admin' : 'User'}</span>
                </div>
              </div>
              {u.referralCode && (
                <div style={{marginTop:'8px', padding:'8px', background:'#f0f8f0', borderRadius:'8px'}}>
                  <p style={{margin:0, fontSize:'12px'}}><strong>Referral Code:</strong> {u.referralCode}</p>
                  <p style={{margin:'3px 0 0 0', fontSize:'12px'}}><strong>Referrals Made:</strong> {u.referralCount || 0}</p>
                  {u.referredBy && <p style={{margin:'3px 0 0 0', fontSize:'12px'}}><strong>Referred By:</strong> {u.referredBy.name} ({u.referredBy.email})</p>}
                </div>
              )}
            </div>
          ))}
          {users.length === 0 && <p style={{textAlign:'center'}}>No users yet.</p>}
        </div>
      )}

      {activeTab === 'support' && (
        <div>
          {messages.map((msg) => (
            <div key={msg._id} style={styles.card}>
              <span style={{float:'right', fontSize:'12px', color: msg.status === 'Replied' ? 'green' : 'orange'}}>{msg.status}</span>
              <h4 style={{margin:'0 0 5px 0'}}>{msg.name}</h4>
              <p style={{fontSize:'12px', color:'#666', margin:0}}>{msg.email}</p>
              <p style={{background:'#f0f0f0', padding:'10px', borderRadius:'5px', marginTop:'10px'}}>"{msg.message}"</p>

              {msg.reply && <p style={{fontSize:'13px', color:'#2C5530', marginTop:'10px'}}><strong>You Replied:</strong> {msg.reply}</p>}

              <div style={{marginTop:'10px', display:'flex', gap:'10px'}}>
                {msg.status !== 'Replied' && (
                    <button onClick={() => handleReply(msg._id)} style={{flex:1, padding:'8px', background:'#2980b9', color:'white', border:'none', borderRadius:'5px'}}>Reply</button>
                )}
                <button onClick={() => handleDeleteMessage(msg._id)} style={{flex:1, padding:'8px', background:'#e74c3c', color:'white', border:'none', borderRadius:'5px'}}>Delete</button>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p style={{textAlign:'center'}}>No messages.</p>}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
