import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal / Form state
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

  // Bulk action category selector state
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState('fashion');
  const [showBulkCategoryMenu, setShowBulkCategoryMenu] = useState(false);

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
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: 'hide' | 'delete' | 'change_category') => {
    if (selectedIds.length === 0) return;
    
    let confirmMsg = '';
    if (action === 'delete') confirmMsg = `delete ${selectedIds.length} products?`;
    else if (action === 'hide') confirmMsg = `hide ${selectedIds.length} products?`;
    else confirmMsg = `change the category of ${selectedIds.length} products to "${bulkCategoryTarget}"?`;

    if (!window.confirm(`Are you sure you want to ${confirmMsg}`)) return;

    try {
      let updatePayload: any = {};
      if (action === 'delete') {
        updatePayload = { status: 'deleted' };
      } else if (action === 'hide') {
        updatePayload = { status: 'hidden' };
      } else {
        updatePayload = { category: bulkCategoryTarget };
      }

      const { error } = await supabase
        .from('products')
        .update(updatePayload)
        .in('id', selectedIds);

      if (error) throw error;
      
      if (action === 'delete') {
        setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      } else {
        setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, ...updatePayload } : p));
      }
      
      setSelectedIds([]);
      setShowBulkCategoryMenu(false);
      alert('Bulk action completed successfully!');
    } catch (err) {
      alert('Bulk action failed. Check connection.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? (Soft-deletes to "deleted")')) return;
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
      // 1. Upload Images to Supabase Storage if any are selected
      let uploadedImageUrls: string[] = editingProduct?.images || [];
      
      if (images.length > 0) {
        for (const file of images) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          // Standard Supabase storage upload
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) {
             console.error('Upload error', uploadError);
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
        image: uploadedImageUrls[0] || editingProduct?.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
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
      alert('Failed to save product. Ensure the products table has the correct schema.');
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

  // Perform search and category filtering in local state
  const filteredProducts = products.filter(p => {
    // 1. Category Filter
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;

    // 2. Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameEn = (p.nameEn || '').toLowerCase();
      const nameBn = (p.nameBn || '').toLowerCase();
      const id = (p.id || '').toLowerCase();
      if (!nameEn.includes(q) && !nameBn.includes(q) && !id.includes(q)) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 font-body-en">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-3xl font-heading-en uppercase border-b-4 border-rukhi-black inline-block pr-8 pb-2 text-[#111111]">
            Products
          </h1>
          <p className="text-sm font-semibold text-gray-500 uppercase mt-2">
            Rukhi Apparel & Electronics Inventory
          </p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-rukhi-black text-white px-5 py-3 font-bold uppercase hover:bg-rukhi-accent transition-colors shadow-[4px_4px_0px_#E63946] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-white p-4 border-2 border-rukhi-black shadow-[4px_4px_0px_#111111]">
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border-2 border-rukhi-black focus:outline-none focus:border-rukhi-accent text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400 shrink-0" />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border-2 border-rukhi-black p-2 text-sm focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="fashion">Fashion</option>
            <option value="electronics">Electronics</option>
            <option value="home_kitchen">Home & Kitchen</option>
            <option value="beauty">Beauty</option>
            <option value="groceries">Groceries</option>
            <option value="gadgets">Gadgets</option>
          </select>
        </div>

        {/* Refresh button */}
        <div className="flex justify-end">
          <button 
            onClick={fetchProducts}
            className="flex items-center gap-2 border-2 border-rukhi-black px-4 py-2 hover:bg-gray-100 font-bold text-xs uppercase"
          >
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>
      </div>

      {/* BULK SELECTION PANEL */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-red-50 border-2 border-[#E63946] shadow-[4px_4px_0px_#111111] flex flex-col md:flex-row gap-4 justify-between items-center animate-in fade-in">
          <div className="flex items-center gap-2 text-sm font-bold text-[#E63946]">
            <AlertCircle size={20} />
            <span>SELECTED {selectedIds.length} PRODUCTS</span>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <button 
              onClick={() => handleBulkAction('hide')}
              className="bg-yellow-500 text-white px-3 py-2 text-xs font-bold uppercase hover:bg-yellow-600 transition-colors border border-rukhi-black shadow-[2px_2px_0px_#111111]"
            >
              Hide Selected
            </button>
            <button 
              onClick={() => handleBulkAction('delete')}
              className="bg-rukhi-accent text-white px-3 py-2 text-xs font-bold uppercase hover:bg-red-700 transition-colors border border-rukhi-black shadow-[2px_2px_0px_#111111]"
            >
              Delete Selected
            </button>

            {/* Change Category Bulk Control */}
            <div className="relative">
              <button 
                onClick={() => setShowBulkCategoryMenu(!showBulkCategoryMenu)}
                className="bg-rukhi-black text-white px-3 py-2 text-xs font-bold uppercase hover:bg-gray-800 transition-colors border border-rukhi-black shadow-[2px_2px_0px_#111111]"
              >
                Change Category
              </button>
              
              {showBulkCategoryMenu && (
                <div className="absolute right-0 mt-2 bg-white border-2 border-rukhi-black p-3 shadow-[4px_4px_0px_#111111] z-50 flex gap-2 items-center w-64">
                  <select 
                    value={bulkCategoryTarget}
                    onChange={(e) => setBulkCategoryTarget(e.target.value)}
                    className="border border-rukhi-black p-1 text-xs focus:outline-none"
                  >
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                    <option value="home_kitchen">Home & Kitchen</option>
                    <option value="beauty">Beauty</option>
                    <option value="groceries">Groceries</option>
                    <option value="gadgets">Gadgets</option>
                  </select>
                  <button 
                    onClick={() => handleBulkAction('change_category')}
                    className="bg-rukhi-accent text-white px-2.5 py-1 text-[10px] font-bold uppercase hover:bg-red-700"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TABULAR LIST */}
      <div className="bg-white border-2 border-rukhi-black shadow-[6px_6px_0px_#111111] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-rukhi-black">
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-rukhi-accent cursor-pointer"
                  checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 font-heading-en text-xs uppercase w-16">Cover</th>
              <th className="p-4 font-heading-en text-xs uppercase">Product Details</th>
              <th className="p-4 font-heading-en text-xs uppercase">Category</th>
              <th className="p-4 font-heading-en text-xs uppercase">Price</th>
              <th className="p-4 font-heading-en text-xs uppercase">Stock Status</th>
              <th className="p-4 font-heading-en text-xs uppercase">Status</th>
              <th className="p-4 font-heading-en text-xs uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-8 text-center font-bold">Loading product records...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center py-8">
                  <p className="text-gray-500 font-bold mb-2">No matching products found.</p>
                  <button onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }} className="text-xs text-rukhi-accent font-bold uppercase underline hover:text-[#111111]">
                    Reset Filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => {
                const isLowStock = Number(product.stock_qty || 0) <= 5;
                const isOutOfStock = Number(product.stock_qty || 0) === 0;

                return (
                  <tr 
                    key={product.id} 
                    className={`border-b border-gray-200 hover:bg-gray-50/50 transition-colors ${selectedIds.includes(product.id) ? 'bg-red-50/50' : ''}`}
                  >
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-rukhi-accent cursor-pointer"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleSelect(product.id)}
                      />
                    </td>
                    <td className="p-4">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.nameEn} 
                          className="w-12 h-12 object-cover border-2 border-rukhi-black shadow-[2px_2px_0px_#111111]" 
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{product.nameEn}</div>
                      {product.nameBn && <div className="text-xs text-gray-400 font-body-bn mt-0.5">{product.nameBn}</div>}
                      <div className="text-[10px] text-gray-400 font-mono mt-1">ID: {product.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs uppercase font-bold tracking-wider bg-gray-100 px-2 py-1 border border-gray-300">
                        {product.category || 'general'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-gray-900">৳ {product.priceEn}</td>
                    <td className="p-4">
                      {isOutOfStock ? (
                        <span className="text-xs font-bold bg-red-100 text-red-900 px-2 py-1 rounded border border-red-300 flex items-center gap-1 w-fit">
                          OUT OF STOCK
                        </span>
                      ) : isLowStock ? (
                        <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-1 rounded border border-amber-300 flex items-center gap-1 w-fit animate-pulse">
                          LOW STOCK ({product.stock_qty})
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-700">
                          {product.stock_qty || 0} Units Available
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase border ${
                        product.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}>
                        {product.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button 
                        onClick={() => openModal(product)} 
                        className="p-2 border-2 border-rukhi-black hover:bg-rukhi-black hover:text-white transition-colors" 
                        title="Edit Product Details"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="p-2 border-2 border-[#E63946] text-[#E63946] hover:bg-[#E63946] hover:text-white transition-colors" 
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ADD/EDIT FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-rukhi-black shadow-[8px_8px_0px_#111111] max-w-2xl w-full max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b-2 border-rukhi-black flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-heading-en uppercase">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="font-bold text-2xl leading-none hover:text-[#E63946] cursor-pointer">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Product Name (EN) *</label>
                  <input required type="text" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Product Name (BN)</label>
                  <input type="text" value={formData.nameBn} onChange={e => setFormData({...formData, nameBn: e.target.value})} className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent text-sm font-body-bn" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Retail Price (৳) *</label>
                  <input required type="number" step="0.01" value={formData.priceEn} onChange={e => setFormData({...formData, priceEn: e.target.value})} className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent text-sm font-mono font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Stock Quantity *</label>
                  <input required type="number" value={formData.stock_qty} onChange={e => setFormData({...formData, stock_qty: e.target.value})} className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent text-sm font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent text-sm">
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                    <option value="home_kitchen">Home & Kitchen</option>
                    <option value="beauty">Beauty</option>
                    <option value="groceries">Groceries</option>
                    <option value="gadgets">Gadgets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Active Visibility Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent text-sm">
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Description (EN)</label>
                  <textarea rows={3} value={formData.descriptionEn} onChange={e => setFormData({...formData, descriptionEn: e.target.value})} className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent text-sm"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">Description (BN)</label>
                  <textarea rows={3} value={formData.descriptionBn} onChange={e => setFormData({...formData, descriptionBn: e.target.value})} className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent text-sm font-body-bn"></textarea>
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" id="cod_available" checked={formData.cod_available} onChange={e => setFormData({...formData, cod_available: e.target.checked})} className="w-5 h-5 accent-rukhi-accent cursor-pointer" />
                <label htmlFor="cod_available" className="font-extrabold text-sm uppercase cursor-pointer selection:bg-transparent">
                  Cash on Delivery (COD) Available
                </label>
              </div>

              <div className="pt-4 border-t-2 border-gray-200">
                <label className="block text-xs font-extrabold uppercase mb-2">Upload Product Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={e => setImages(Array.from(e.target.files || []))}
                  className="w-full border-2 border-rukhi-black p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-extrabold file:bg-rukhi-black file:text-white hover:file:bg-[#E63946] file:uppercase file:tracking-wider cursor-pointer" 
                />
                <p className="text-[11px] text-gray-500 mt-1.5 font-medium leading-relaxed">
                  You can select multiple covers to upload to Supabase Storage. The first one will serve as the default thumbnail.
                </p>
              </div>

              {/* Show uploaded image previews */}
              {editingProduct?.images && editingProduct.images.length > 0 && (
                <div className="space-y-2">
                  <span className="block text-xs font-extrabold uppercase">Uploaded Cover Images</span>
                  <div className="flex flex-wrap gap-2">
                    {editingProduct.images.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative group border border-gray-300">
                        <img src={imgUrl} alt="Product Cover" className="w-16 h-16 object-cover" />
                        <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] px-1 font-mono font-bold">#{idx+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t-2 border-rukhi-black flex justify-end gap-3.5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 font-bold uppercase text-xs border-2 border-rukhi-black hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading} 
                  className="bg-rukhi-black text-white px-6 py-3 font-bold uppercase text-xs hover:bg-[#E63946] transition-colors shadow-[4px_4px_0px_#E63946] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:shadow-none cursor-pointer"
                >
                  {uploading ? 'Processing Cover Uploads...' : 'Save Product Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
