import { useToast } from '../components/Toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/apiService';

const AddProduct = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [watts, setWatts] = useState('');
  const [recipes, setRecipes] = useState('');
  const [category, setCategory] = useState('Kitchen Appliances');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('watts', watts);
    formData.append('recipes', recipes);
    formData.append('category', category);
    formData.append('description', description);
    if (file) formData.append('image', file);

    try {
      await productAPI.create(formData);
      toast('Product Added!', "success");
      navigate('/');
    } catch (err) {
      console.warn('Failed to add product');
      toast('Failed: ' + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'sans-serif', paddingBottom:'100px' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' },
    btn: { width: '100%', padding: '15px', background: '#2C5530', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <h2 style={{color: '#2C5530'}}>Add Inventory</h2>
      <form onSubmit={handleSubmit}>
        <label>Item Name</label>
        <input value={name} onChange={e => setName(e.target.value)} style={styles.input} required />

        <label>Price (GHS)</label>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={styles.input} required />

        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} style={styles.input}>
          <option>Kitchen Appliances</option>
          <option>Home Appliances</option>
          <option>Electronics</option>
          <option>Accessories</option>
          <option>Clothing & Fashion</option>
          <option>Personal Care</option>
          <option>Others</option>
        </select>

        <label>Power (Watts) - Optional</label>
        <input type="number" placeholder="e.g. 1500" value={watts} onChange={e => setWatts(e.target.value)} style={styles.input} />

        <label>Features / Uses - Optional</label>
        <input placeholder="e.g. Blends fruits, Makes smoothies, Grinds pepper" value={recipes} onChange={e => setRecipes(e.target.value)} style={styles.input} />

        <label>Image</label>
        <input type="file" onChange={e => setFile(e.target.files[0])} style={{marginBottom:'20px'}} />



        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} style={{...styles.input, height:'100px'}} />

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
