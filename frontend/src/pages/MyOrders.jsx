import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/apiService';

const statusSteps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const statusColors = {
  Pending: '#f59e0b',
  Confirmed: '#3b82f6',
  Processing: '#8b5cf6',
  Shipped: '#f97316',
  Delivered: '#22c55e',
  Cancelled: '#ef4444'
};

const statusIcons = {
  Pending: '🕐',
  Confirmed: '✅',
  Processing: '⚙️',
  Shipped: '🚚',
  Delivered: '📦',
  Cancelled: '❌'
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.email) { navigate('/login'); return; }
    orderAPI.getAll().then(data => {
      const myOrders = Array.isArray(data) ? data.filter(o => o.userEmail === user.email) : [];
      setOrders(myOrders.reverse());
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><p>Loading orders...</p></div>;

  return (
    <div style={{minHeight:'100vh', background:'#f8f8f8', paddingBottom:'80px'}}>
      <div style={{background:'#2C5530', padding:'50px 20px 20px', color:'white', display:'flex', alignItems:'center', gap:'15px'}}>
        <button onClick={() => navigate(-1)} style={{background:'none', border:'none', color:'white', fontSize:'22px', cursor:'pointer'}}>←</button>
        <h2 style={{margin:0, fontSize:'20px'}}>My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div style={{textAlign:'center', padding:'60px 20px'}}>
          <div style={{fontSize:'60px', marginBottom:'15px'}}>📦</div>
          <h3 style={{color:'#555'}}>No orders yet</h3>
          <button onClick={() => navigate('/')} style={{marginTop:'15px', padding:'12px 25px', background:'#2C5530', color:'white', border:'none', borderRadius:'10px', fontSize:'15px', cursor:'pointer'}}>Start Shopping</button>
        </div>
      ) : (
        <div style={{padding:'15px'}}>
          {orders.map(order => {
            const stepIndex = statusSteps.indexOf(order.status);
            const isExpanded = expanded === order._id;
            return (
              <div key={order._id} style={{background:'white', borderRadius:'15px', marginBottom:'15px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)', overflow:'hidden'}}>
                <div onClick={() => setExpanded(isExpanded ? null : order._id)} style={{padding:'15px', cursor:'pointer'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                    <span style={{fontWeight:'bold', color:'#333', fontSize:'14px'}}>Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span style={{background:statusColors[order.status] + '20', color:statusColors[order.status], padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold'}}>
                      {statusIcons[order.status]} {order.status}
                    </span>
                  </div>
                  <div style={{color:'#888', fontSize:'13px', marginBottom:'5px'}}>
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'})}
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{color:'#555', fontSize:'13px'}}>{order.items?.length} item(s)</span>
                    <span style={{fontWeight:'bold', color:'#2C5530', fontSize:'16px'}}>GHS {order.total?.toFixed(2)}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{borderTop:'1px solid #f0f0f0', padding:'15px'}}>
                    {order.status !== 'Cancelled' && (
                      <div style={{marginBottom:'20px'}}>
                        <p style={{fontWeight:'bold', color:'#333', marginBottom:'12px', fontSize:'14px'}}>Order Progress</p>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative'}}>
                          <div style={{position:'absolute', top:'12px', left:'10%', right:'10%', height:'3px', background:'#e0e0e0', zIndex:0}} />
                          <div style={{position:'absolute', top:'12px', left:'10%', width: stepIndex > 0 ? `${(stepIndex / (statusSteps.length-1)) * 80}%` : '0%', height:'3px', background:'#2C5530', zIndex:1, transition:'width 0.5s'}} />
                          {statusSteps.map((step, i) => (
                            <div key={step} style={{display:'flex', flexDirection:'column', alignItems:'center', zIndex:2}}>
                              <div style={{width:'24px', height:'24px', borderRadius:'50%', background: i <= stepIndex ? '#2C5530' : '#e0e0e0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', color:'white', marginBottom:'5px'}}>
                                {i < stepIndex ? '✓' : i === stepIndex ? '●' : ''}
                              </div>
                              <span style={{fontSize:'9px', color: i <= stepIndex ? '#2C5530' : '#aaa', textAlign:'center', maxWidth:'45px'}}>{step}</span>
                            </div>
                          ))}
                        </div>
                        {order.estimatedDelivery && (
                          <p style={{color:'#2C5530', fontSize:'13px', marginTop:'12px', textAlign:'center'}}>
                            🗓 Estimated delivery: {order.estimatedDelivery}
                          </p>
                        )}
                      </div>
                    )}

                    <p style={{fontWeight:'bold', color:'#333', marginBottom:'8px', fontSize:'14px'}}>Items</p>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f5f5f5', fontSize:'13px'}}>
                        <span style={{color:'#555'}}>{item.name} x{item.quantity}</span>
                        <span style={{color:'#333', fontWeight:'bold'}}>GHS {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={{display:'flex', justifyContent:'space-between', marginTop:'10px', fontWeight:'bold'}}>
                      <span>Total</span>
                      <span style={{color:'#2C5530'}}>GHS {order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
