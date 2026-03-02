import { useToast } from '../components/Toast';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/apiService';

const EditProduct = () => {
  const toast = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', price: '', category: '', description: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productAPI.getById(id);
        setFormData(res);
      } catch (err) {
        console.warn('Failed to fetch product');
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    if (image) data.append('image', image);

    try {
      await productAPI.update(id, data);
      toast('Inventory Updated Successfully!', "success");
      navigate('/dashboard');
    } catch (err) {
      console.warn('Update failed');
      toast('Update failed', "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' };

  return (
    <div style={{ padding: '20px', background: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ color: '#2E7D32' }}>Edit Inventory Item</h2>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>

        <label>Product Name</label>
        <input style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />

        <label>Price (GHS)</label>
        <input style={inputStyle} type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />

        <label>Category</label>
        <select style={inputStyle} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
          <option>Kitchen Appliances</option>
          <option>Cookware</option>
          <option>Utensils</option>
          <option>Electronics</option>
        </select>

        <label>Change Image (Optional)</label>
        <input style={inputStyle} type="file" onChange={e => setImage(e.target.files[0])} />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: '#2E7D32', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px' }}>
          {loading ? 'Updating...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
