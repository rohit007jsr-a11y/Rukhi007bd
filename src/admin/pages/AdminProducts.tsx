import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    nameEn: '',
    nameBn: '',
    descriptionEn: '',
    descriptionBn: '',
    priceEn: '',
    stock_qty: '',
    category: 'fashion',
    cod_available: true,
    status: 'active',
  });
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error(error);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: 'hide' | 'delete') => {
    if (selectedIds.length === 0) return;
    const confirmMsg = action === 'delete' ? 'delete' : 'hide';
    if (!window.confirm(`Are you sure you want to ${confirmMsg} ${selectedIds.length} products?`)) return;

    try {
      const newStatus = action === 'delete' ? 'deleted' : 'hidden';
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .in('id', selectedIds);

      if (error) throw error;
      
      setProducts(prev => {
        if (action === 'delete') {
          return prev.filter(p => !selectedIds.includes(p.id));
        } else {
          return prev.map(p => selectedIds.includes(p.id) ? { ...p, status: newStatus } : p);
        }
      });
      setSelectedIds([]);
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Upload Images to Supabase Storage if any
      let uploadedImageUrls: string[] = editingProduct?.images || [];
      
      if (images.length > 0) {
        for (const file of images) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) {
             console.error('Upload error', uploadError);
             // handle storage not found gracefully if it's not setup yet
          } else {
             const { data: publicUrlData } = supabase.storage
              .from('product-images')
              .getPublicUrl(filePath);
             uploadedImageUrls.push(publicUrlData.publicUrl);
          }
        }
      }

      const productPayload = {
        nameEn: formData.nameEn,
        nameBn: formData.nameBn,
        descriptionEn: formData.descriptionEn,
        descriptionBn: formData.descriptionBn,
        priceEn: parseFloat(formData.priceEn),
        stock_qty: parseInt(formData.stock_qty, 10),
        category: formData.category,
        cod_available: formData.cod_available,
        status: formData.status,
        images: uploadedImageUrls,
        image: uploadedImageUrls[0] || editingProduct?.image || '',
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productPayload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product. Does the table exist?');
    } finally {
      setUploading(false);
      setImages([]);
    }
  };

  const openModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nameEn: product.nameEn || '',
        nameBn: product.nameBn || '',
        descriptionEn: product.descriptionEn || '',
        descriptionBn: product.descriptionBn || '',
        priceEn: product.priceEn?.toString() || '',
        stock_qty: product.stock_qty?.toString() || '',
        category: product.category || 'fashion',
        cod_available: product.cod_available ?? true,
        status: product.status || 'active',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nameEn: '', nameBn: '', descriptionEn: '', descriptionBn: '',
        priceEn: '', stock_qty: '', category: 'fashion', cod_available: true, status: 'active'
      });
    }
    setImages([]);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-heading-en uppercase border-b-4 border-rukhi-black inline-block pr-8 pb-2">Products</h1>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <button 
                onClick={() => handleBulkAction('hide')}
                className="bg-yellow-500 text-white px-4 py-2 font-bold uppercase hover:bg-yellow-600 transition-colors shadow-[4px_4px_0px_#111111] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Hide Selected
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                className="bg-rukhi-accent text-white px-4 py-2 font-bold uppercase hover:bg-red-700 transition-colors shadow-[4px_4px_0px_#111111] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Delete Selected
              </button>
            </>
          )}
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-rukhi-black text-white px-4 py-2 font-bold uppercase hover:bg-rukhi-accent transition-colors shadow-[4px_4px_0px_#E63946] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-rukhi-black shadow-[6px_6px_0px_#111111] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-rukhi-black">
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-rukhi-accent"
                  checked={products.length > 0 && selectedIds.length === products.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 font-heading-en uppercase w-16">Image</th>
              <th className="p-4 font-heading-en uppercase">Name</th>
              <th className="p-4 font-heading-en uppercase">Price</th>
              <th className="p-4 font-heading-en uppercase">Stock</th>
              <th className="p-4 font-heading-en uppercase">Status</th>
              <th className="p-4 font-heading-en uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center">Loading products...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="p-4 text-center py-8">
                <p className="text-gray-500 mb-2">No products found in database.</p>
                <p className="text-sm">Click 'Add Product' to create one.</p>
              </td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${selectedIds.includes(product.id) ? 'bg-red-50' : ''}`}>
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-rukhi-accent"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => handleSelect(product.id)}
                    />
                  </td>
                  <td className="p-4">
                    {product.image ? (
                      <img src={product.image} alt={product.nameEn} className="w-12 h-12 object-cover border border-gray-300" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{product.nameEn}</div>
                    <div className="text-xs text-gray-500">{product.category}</div>
                  </td>
                  <td className="p-4 font-mono">৳ {product.priceEn}</td>
                  <td className="p-4">{product.stock_qty || 0}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold uppercase ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                      {product.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openModal(product)} className="p-2 border-2 border-rukhi-black hover:bg-rukhi-black hover:text-white transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 border-2 border-rukhi-accent text-rukhi-accent hover:bg-rukhi-accent hover:text-white transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-rukhi-black shadow-[8px_8px_0px_#111111] max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b-2 border-rukhi-black flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-heading-en uppercase">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="font-bold text-2xl leading-none hover:text-rukhi-accent">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Name (EN) *</label>
                  <input required type="text" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} className="w-full border-2 border-rukhi-black p-2 focus:outline-none focus:border-rukhi-accent" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Name (BN)</label>
                  <input type="text" value={formData.nameBn} onChange={e => setFormData({...formData, nameBn: e.target.value})} className="w-full border-2 border-rukhi-black p-2 focus:outline-none focus:border-rukhi-accent font-body-bn" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Price (৳) *</label>
                  <input required type="number" step="0.01" value={formData.priceEn} onChange={e => setFormData({...formData, priceEn: e.target.value})} className="w-full border-2 border-rukhi-black p-2 focus:outline-none focus:border-rukhi-accent" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Stock Quantity *</label>
                  <input required type="number" value={formData.stock_qty} onChange={e => setFormData({...formData, stock_qty: e.target.value})} className="w-full border-2 border-rukhi-black p-2 focus:outline-none focus:border-rukhi-accent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-2 border-rukhi-black p-2 focus:outline-none focus:border-rukhi-accent">
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                    <option value="home_kitchen">Home & Kitchen</option>
                    <option value="beauty">Beauty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border-2 border-rukhi-black p-2 focus:outline-none focus:border-rukhi-accent">
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Description (EN)</label>
                <textarea rows={3} value={formData.descriptionEn} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} className="w-full border-2 border-rukhi-black p-2 focus:outline-none focus:border-rukhi-accent"></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="cod_available" checked={formData.cod_available} onChange={e => setFormData({...formData, cod_available: e.target.checked})} className="w-5 h-5 accent-rukhi-accent" />
                <label htmlFor="cod_available" className="font-bold">Cash on Delivery (COD) Available</label>
              </div>

              <div className="pt-4 border-t-2 border-gray-200">
                <label className="block text-sm font-bold mb-1">Product Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={e => setImages(Array.from(e.target.files || []))}
                  className="w-full border-2 border-rukhi-black p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-rukhi-black file:text-white hover:file:bg-rukhi-accent cursor-pointer" 
                />
                <p className="text-xs text-gray-500 mt-1">Select multiple files. Will be uploaded to Supabase Storage ('product-images' bucket).</p>
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold uppercase border-2 border-rukhi-black hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={uploading} className="bg-rukhi-black text-white px-6 py-3 font-bold uppercase hover:bg-rukhi-accent transition-colors shadow-[4px_4px_0px_#E63946] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:shadow-none">
                  {uploading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};