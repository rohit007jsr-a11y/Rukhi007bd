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
    imageUrls: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dbColumns, setDbColumns] = useState<string[]>([]);

  // Bulk action category selector state
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState('fashion');
  const [showBulkCategoryMenu, setShowBulkCategoryMenu] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let dbMapped: any[] = [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        const rawProducts = data || [];
        if (rawProducts.length > 0) {
          const columns = Object.keys(rawProducts[0]);
          setDbColumns(columns);
        } else {
          setDbColumns(['id', 'name', 'category', 'price', 'description', 'image_url', 'stock', 'badge', 'is_featured', 'created_at']);
        }

        dbMapped = rawProducts
          .filter((p: any) => p.name !== 'SYSTEM_SETTINGS')
          .map((p: any) => {
            return {
              id: p.id.toString(),
              nameEn: p.nameEn ?? p.name ?? '',
              nameBn: p.nameBn ?? p.name ?? '',
              descriptionEn: p.descriptionEn ?? p.description ?? '',
              descriptionBn: p.descriptionBn ?? p.description ?? '',
              priceEn: Number(p.priceEn ?? p.price ?? 0),
              stock_qty: Number(p.stock_qty ?? p.stock ?? 10),
              category: p.category || 'fashion',
              cod_available: p.cod_available ?? (p.badge?.toLowerCase().includes('cod') || true),
              status: p.status ?? (p.is_featured === false ? 'hidden' : 'active'),
              images: p.images ?? (p.image_url ? [p.image_url] : p.image ? [p.image] : []),
              image: p.image ?? p.image_url ?? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
            };
          })
          .filter((p: any) => p.status !== 'deleted');
      }

      // Read local cache overrides/additions
      let cached: any[] = [];
      try {
        const localStr = localStorage.getItem('rukhi_products_cache');
        if (localStr) {
          cached = JSON.parse(localStr);
        }
      } catch (e) {}

      // Combine products: start with DB products or static products, overlay cached updates/additions
      const map = new Map<string, any>();
      
      if (dbMapped.length === 0) {
        const staticList = [
          { id: 'p1', nameEn: 'Oversized Premium Cotton Tee', nameBn: 'ওভারসাইজড প্রিমিয়াম কটন টি-শার্ট', priceEn: 890, stock_qty: 15, category: 'fashion', status: 'active', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800', cod_available: true, images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'] },
          { id: 'p2', nameEn: 'Wireless ANC Earbuds Pro', nameBn: 'ট্রু ওয়ারলেস এএনসি ইয়ারবাড প্রো', priceEn: 2450, stock_qty: 8, category: 'electronics', status: 'active', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800', cod_available: true, images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800'] },
          { id: 'p3', nameEn: 'Non-Stick Granite Frying Pan', nameBn: 'নন-স্টিক গ্রানাইট ফ্রাইপ্যান (26cm)', priceEn: 1290, stock_qty: 12, category: 'home_kitchen', status: 'active', image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800', cod_available: true, images: ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800'] },
          { id: 'p4', nameEn: 'Vitamin C Radiance Face Serum', nameBn: 'ভিটামিন সি রেডিয়েন্স ফেস সিরাম', priceEn: 750, stock_qty: 20, category: 'beauty', status: 'active', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800', cod_available: true, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'] },
          { id: 'p5', nameEn: 'Organic Green Tea & Nuts Combo', nameBn: 'অর্গানিক গ্রিন টি ও ড্রাই ফ্রুটস কম্বো', priceEn: 980, stock_qty: 18, category: 'groceries', status: 'active', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800', cod_available: true, images: ['https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800'] },
          { id: 'p6', nameEn: 'Adjustable Metal Desk Phone Stand', nameBn: 'এডজাস্টেবল মেটাল ফোন স্ট্যান্ড', priceEn: 550, stock_qty: 25, category: 'gadgets', status: 'active', image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=800', cod_available: true, images: ['https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&q=80&w=800'] },
        ];
        staticList.forEach(p => map.set(p.id, p));
      } else {
        dbMapped.forEach(p => map.set(p.id, p));
      }

      cached.forEach(p => {
        if (p.status === 'deleted') {
          map.delete(p.id);
        } else {
          map.set(p.id, p);
        }
      });

      const finalProducts = Array.from(map.values());
      setProducts(finalProducts);
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
      let isDelete = action === 'delete';
      let isHide = action === 'hide';

      if (isDelete && !dbColumns.includes('status')) {
        // Hard delete if status column doesn't exist
        const { error } = await supabase
          .from('products')
          .delete()
          .in('id', selectedIds);
        if (error) throw error;
        setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
        setSelectedIds([]);
        alert('Bulk action completed successfully!');
        return;
      }

      let updatePayload: any = {};
      if (isDelete) {
        updatePayload = { status: 'deleted' };
      } else if (isHide) {
        if (dbColumns.includes('status')) {
          updatePayload = { status: 'hidden' };
        } else if (dbColumns.includes('is_featured')) {
          updatePayload = { is_featured: false };
        }
      } else {
        if (dbColumns.includes('category')) {
          updatePayload = { category: bulkCategoryTarget };
        }
      }

      const { error } = await supabase
        .from('products')
        .update(updatePayload)
        .in('id', selectedIds);

      if (error) throw error;
      
      if (isDelete) {
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
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const isNumericId = /^\d+$/.test(id.toString());
      const queryId = isNumericId ? Number(id) : id;

      if (!dbColumns.includes('status')) {
        await supabase
          .from('products')
          .delete()
          .eq('id', queryId);
      } else {
        await supabase
          .from('products')
          .update({ status: 'deleted' })
          .eq('id', queryId);
      }
    } catch (err) {
      console.warn('DB delete warning:', err);
    }

    // Persist deletion locally
    let localCache: any[] = [];
    try {
      const raw = localStorage.getItem('rukhi_products_cache');
      if (raw) localCache = JSON.parse(raw);
    } catch (e) {}

    const idx = localCache.findIndex((p: any) => p.id === id);
    if (idx >= 0) {
      localCache[idx].status = 'deleted';
    } else {
      localCache.push({ id, status: 'deleted' });
    }
    localStorage.setItem('rukhi_products_cache', JSON.stringify(localCache));

    window.dispatchEvent(new CustomEvent('rukhi-products-updated'));
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Canvas image compression helper to prevent payload size errors
  const compressImageFile = (file: File, maxDim = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(reader.result as string);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Process image file upload via server endpoint or compressed data URL
  const processImageUpload = async (file: File): Promise<string> => {
    const compressedDataUrl = await compressImageFile(file);
    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: compressedDataUrl, filename: file.name }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.url) {
          return json.url;
        }
      }
    } catch (e) {
      console.warn('Server upload endpoint unreachable, falling back to compressed image URL:', e);
    }
    return compressedDataUrl;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Parse manual image URLs from input field
      let manualUrls: string[] = formData.imageUrls
        ? formData.imageUrls.split(',').map(url => url.trim()).filter(Boolean)
        : [];

      let uploadedImageUrls: string[] = [...manualUrls];

      // 2. Upload file inputs
      if (images.length > 0) {
        for (const file of images) {
          const uploadedUrl = await processImageUpload(file);
          if (uploadedUrl) {
            uploadedImageUrls.push(uploadedUrl);
          }
        }
      }

      // Ensure we have unique URLs
      uploadedImageUrls = Array.from(new Set(uploadedImageUrls));

      const actualCols = dbColumns.length > 0 ? dbColumns : ['id', 'name', 'category', 'price', 'description', 'image_url', 'stock', 'badge', 'is_featured', 'created_at'];

      const productPayload: any = {};

      // Name
      const nameVal = formData.nameEn.trim() || formData.nameBn.trim() || 'New Streetwear Product';
      if (actualCols.includes('name')) {
        productPayload.name = nameVal;
      }
      if (actualCols.includes('nameEn')) {
        productPayload.nameEn = formData.nameEn.trim() || nameVal;
      }
      if (actualCols.includes('nameBn')) {
        productPayload.nameBn = formData.nameBn.trim() || nameVal;
      }

      // Description
      const descVal = formData.descriptionEn.trim() || formData.descriptionBn.trim() || 'Rukhi streetwear item.';
      if (actualCols.includes('description')) {
        productPayload.description = descVal;
      }
      if (actualCols.includes('descriptionEn')) {
        productPayload.descriptionEn = formData.descriptionEn.trim() || descVal;
      }
      if (actualCols.includes('descriptionBn')) {
        productPayload.descriptionBn = formData.descriptionBn.trim() || descVal;
      }

      // Price
      const priceNum = parseFloat(formData.priceEn) || 0;
      if (actualCols.includes('price')) {
        productPayload.price = priceNum;
      }
      if (actualCols.includes('priceEn')) {
        productPayload.priceEn = priceNum;
      }

      // Stock
      const stockNum = parseInt(formData.stock_qty, 10) || 10;
      if (actualCols.includes('stock')) {
        productPayload.stock = stockNum;
      }
      if (actualCols.includes('stock_qty')) {
        productPayload.stock_qty = stockNum;
      }

      // Category
      if (actualCols.includes('category')) {
        productPayload.category = formData.category || 'fashion';
      }

      // COD Available & Badge
      if (actualCols.includes('cod_available')) {
        productPayload.cod_available = formData.cod_available;
      }
      if (actualCols.includes('badge')) {
        productPayload.badge = formData.cod_available ? 'COD Available' : '';
      }

      // Status & Featured
      if (actualCols.includes('status')) {
        productPayload.status = formData.status;
      }
      if (actualCols.includes('is_featured')) {
        productPayload.is_featured = formData.status === 'active';
      }

      // Main image URL selection
      const mainImageUrl = uploadedImageUrls[0] || editingProduct?.image || editingProduct?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800';

      const updatedProductObj = {
        id: editingProduct ? editingProduct.id.toString() : `prod_${Date.now()}`,
        nameEn: formData.nameEn.trim() || formData.nameBn.trim() || 'New Streetwear Product',
        nameBn: formData.nameBn.trim() || '',
        descriptionEn: formData.descriptionEn.trim() || 'Rukhi streetwear item.',
        descriptionBn: formData.descriptionBn.trim() || '',
        priceEn: parseFloat(formData.priceEn) || 0,
        stock_qty: parseInt(formData.stock_qty, 10) || 10,
        category: formData.category || 'fashion',
        cod_available: formData.cod_available,
        status: formData.status || 'active',
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [mainImageUrl],
        image: mainImageUrl,
      };

      // 1. Attempt Supabase DB update/insert
      try {
        const actualCols = dbColumns.length > 0 ? dbColumns : ['id', 'name', 'category', 'price', 'description', 'image_url', 'stock', 'badge', 'is_featured', 'created_at'];
        const productPayload: any = {};

        if (actualCols.includes('name')) productPayload.name = updatedProductObj.nameEn;
        if (actualCols.includes('nameEn')) productPayload.nameEn = updatedProductObj.nameEn;
        if (actualCols.includes('nameBn')) productPayload.nameBn = updatedProductObj.nameBn;

        if (actualCols.includes('description')) productPayload.description = updatedProductObj.descriptionEn;
        if (actualCols.includes('descriptionEn')) productPayload.descriptionEn = updatedProductObj.descriptionEn;
        if (actualCols.includes('descriptionBn')) productPayload.descriptionBn = updatedProductObj.descriptionBn;

        if (actualCols.includes('price')) productPayload.price = updatedProductObj.priceEn;
        if (actualCols.includes('priceEn')) productPayload.priceEn = updatedProductObj.priceEn;

        if (actualCols.includes('stock')) productPayload.stock = updatedProductObj.stock_qty;
        if (actualCols.includes('stock_qty')) productPayload.stock_qty = updatedProductObj.stock_qty;

        if (actualCols.includes('category')) productPayload.category = updatedProductObj.category;
        if (actualCols.includes('cod_available')) productPayload.cod_available = updatedProductObj.cod_available;
        if (actualCols.includes('badge')) productPayload.badge = updatedProductObj.cod_available ? 'COD Available' : '';

        if (actualCols.includes('status')) productPayload.status = updatedProductObj.status;
        if (actualCols.includes('is_featured')) productPayload.is_featured = updatedProductObj.status === 'active';

        if (actualCols.includes('image_url')) productPayload.image_url = mainImageUrl;
        if (actualCols.includes('image')) productPayload.image = mainImageUrl;
        if (actualCols.includes('images')) productPayload.images = updatedProductObj.images;

        if (editingProduct) {
          const isNumericId = /^\d+$/.test(editingProduct.id.toString());
          const queryId = isNumericId ? Number(editingProduct.id) : editingProduct.id;
          await supabase.from('products').update(productPayload).eq('id', queryId);
        } else {
          await supabase.from('products').insert([productPayload]);
        }
      } catch (dbErr) {
        console.warn('Supabase DB sync note (saved to cache):', dbErr);
      }

      // 2. Always persist locally so state is 100% saved across refreshes
      let localCache: any[] = [];
      try {
        const raw = localStorage.getItem('rukhi_products_cache');
        if (raw) localCache = JSON.parse(raw);
      } catch (e) {}

      const existingIdx = localCache.findIndex((p: any) => p.id === updatedProductObj.id);
      if (existingIdx >= 0) {
        localCache[existingIdx] = updatedProductObj;
      } else {
        localCache.push(updatedProductObj);
      }
      localStorage.setItem('rukhi_products_cache', JSON.stringify(localCache));

      // 3. Dispatch real-time event to update storefront
      window.dispatchEvent(new CustomEvent('rukhi-products-updated'));

      setIsModalOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err: any) {
      console.error('Save product error:', err);
      alert(`Failed to save product: ${err.message || 'Check form fields.'}`);
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
        imageUrls: product.images ? product.images.join(', ') : '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nameEn: '', nameBn: '', descriptionEn: '', descriptionBn: '',
        priceEn: '', stock_qty: '', category: 'fashion', cod_available: true, status: 'active',
        imageUrls: '',
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

              <div className="pt-4 border-t-2 border-gray-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="block text-xs font-extrabold uppercase">Image URL or Select Streetwear Preset</label>
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase">Quick Catalog Presets:</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pb-1">
                  {[
                    { label: 'Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Graphic Tee', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Cargo Pants', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Urban Jacket', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Jamdani Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrls: preset.url })}
                      className="px-2 py-1 text-[10px] font-bold uppercase bg-gray-100 hover:bg-[#111111] hover:text-white border border-gray-300 transition-colors cursor-pointer"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>

                <input 
                  type="text" 
                  value={formData.imageUrls} 
                  onChange={e => setFormData({...formData, imageUrls: e.target.value})} 
                  placeholder="https://images.unsplash.com/..., https://..." 
                  className="w-full border-2 border-rukhi-black p-2.5 focus:outline-none focus:border-rukhi-accent text-sm" 
                />
                <p className="text-[11px] text-gray-500 mt-1 font-medium leading-relaxed">
                  Provide external image URLs directly, select a preset above, or upload file below.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-xs font-extrabold uppercase mb-2">Upload Product Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={e => setImages(Array.from(e.target.files || []))}
                  className="w-full border-2 border-rukhi-black p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-extrabold file:bg-rukhi-black file:text-white hover:file:bg-[#E63946] file:uppercase file:tracking-wider cursor-pointer" 
                />
                <p className="text-[11px] text-gray-500 mt-1.5 font-medium leading-relaxed">
                  Alternatively, select files to upload. If the bucket is missing/inaccessible, they will automatically be encoded safely as Base64.
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
