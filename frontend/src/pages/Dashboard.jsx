import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [banners, setBanners] = useState([]);
  const [messages, setMessages] = useState([]); 
  
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) navigate('/'); 
    else setUser(JSON.parse(storedUser));
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [resProd, resOrd, resBan, resMsg] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/orders'),
        axios.get('http://localhost:5000/api/banners'),
        axios.get('http://localhost:5000/api/support') 
      ]);
      setProducts(resProd.data);
      setOrders(resOrd.data.reverse());
      setBanners(resBan.data);
      setMessages(resMsg.data.reverse());
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleReply = async (id) => {
    const reply = prompt("Enter your reply:");
    if (reply) {
      await axios.put(`http://localhost:5000/api/support/${id}/reply`, { reply });
      alert("Reply sent!");
      fetchData();
    }
  };

  // NEW: Delete Message
  const handleDeleteMessage = async (id) => {
    if(confirm('Delete this message?')) {
      await axios.delete(`http://localhost:5000/api/support/${id}`);
      fetchData();
    }
  };

  const handleDeleteProduct = async (id) => { if(confirm('Delete item?')) { await axios.delete(`http://localhost:5000/api/products/${id}`); fetchData(); } };
  const handleDeleteBanner = async (id) => { if(confirm('Delete Banner?')) { await axios.delete(`http://localhost:5000/api/banners/${id}`); fetchData(); } };
  const markDelivered = async (id) => { if(confirm('Mark Delivered?')) { await axios.put(`http://localhost:5000/api/orders/${id}`, { status: 'Delivered' }); fetchData(); } };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
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
              {order.status === 'Pending' && <button onClick={() => markDelivered(order._id)} style={{marginTop:'10px', width:'100%', padding:'10px', background:'#2C5530', color:'white', border:'none', borderRadius:'5px'}}>Mark Delivered</button>}
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

      {/* SUPPORT TAB */}
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
                {/* DELETE BUTTON */}
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
