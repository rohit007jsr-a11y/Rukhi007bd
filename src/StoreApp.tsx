/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Language, CartItem, Product, LookbookPost } from './types';
import { products as localProducts } from './data/products';
import { supabase } from './utils/supabase';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { BestSellers } from './components/BestSellers';
import { WhyUs } from './components/WhyUs';
import { AboutSection } from './components/AboutSection';
import { LookbookSection } from './components/LookbookSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductQuickView } from './components/ProductQuickView';
import { SearchModal } from './components/SearchModal';
import { LookbookModal } from './components/LookbookModal';
import { AuthModal } from './components/AuthModal';
import { PolicyModal } from './components/PolicyModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { TermsPage } from './pages/TermsPage';

export default function StoreApp() {
  // Language State - default 'en'
  const [lang, setLang] = useState<Language>('en');
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Dynamic Products and Settings (initialized with local catalog so immediate view is rich)
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [storeSettings, setStoreSettings] = useState<any>({});

  // Policy Modal state
  const [policyModal, setPolicyModal] = useState<{
    isOpen: boolean;
    type: 'cod' | 'return' | 'size' | 'track' | null;
    title: string;
    content: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
    content: '',
  });

  const handleOpenPolicy = (type: 'cod' | 'return' | 'size' | 'track') => {
    let title = '';
    let content = '';

    switch (type) {
      case 'cod':
        title = lang === 'en' ? 'Cash On Delivery Policy' : 'ক্যাশ অন ডেলিভারি নীতি';
        content = storeSettings.codPolicy || storeSettings.codMessage || '1. 100% Cash on Delivery across Bangladesh.\n2. Inspect parcel before payment.\n3. Return instantly if damaged or incorrect.';
        break;
      case 'return':
        title = lang === 'en' ? '7-Day Return Policy' : '৭ দিনের রিটার্ন নীতি';
        content = storeSettings.returnPolicy || '1. 7-day return or exchange for unworn items with tags.\n2. Contact support at ' + (storeSettings.contactPhone || '+8801700998877') + ' or ' + (storeSettings.contactEmail || 'hello@rukhibd.com') + '.';
        break;
      case 'size':
        title = lang === 'en' ? 'Size Guide' : 'সাইজ গাইড';
        content = storeSettings.sizeGuide || 'Standard Apparel Measurements:\nS: Chest 36"\nM: Chest 38"\nL: Chest 40"\nXL: Chest 42"\nXXL: Chest 44"';
        break;
      case 'track':
        title = lang === 'en' ? 'Track Order Guidance' : 'অর্ডার ট্র্যাকিং গাইড';
        content = storeSettings.trackOrderInfo || 'Provide your order ID or phone number to check your shipment status or call helpline (' + (storeSettings.contactPhone || '+8801700998877') + ').';
        break;
    }

    setPolicyModal({ isOpen: true, type, title, content });
  };

  // User Auth State
  const [currentUser, setCurrentUser] = useState<{ email: string; name?: string; phone?: string; address?: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('register');
  const [pendingOrderCallback, setPendingOrderCallback] = useState<(() => void) | null>(null);

  // Seed cart initialized with 2 items so cart badge starts at 2 as requested in prompt!
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load products and settings from Supabase
  useEffect(() => {
    async function loadDynamicData() {
      try {
        let dbProducts: Product[] = [];
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const settingsProduct = data.find(p => p.name === 'SYSTEM_SETTINGS');
          if (settingsProduct && settingsProduct.description) {
            try {
              setStoreSettings(JSON.parse(settingsProduct.description));
            } catch(e) {}
          }
          
          dbProducts = data
            .filter(p => p.name !== 'SYSTEM_SETTINGS' && p.status !== 'hidden')
            .map((p: any) => ({
              id: p.id.toString(),
              nameEn: p.nameEn ?? p.name ?? '',
              nameBn: p.nameBn ?? p.name ?? '',
              category: p.category ?? 'fashion',
              categoryEn: p.category ? p.category.toUpperCase() : 'FASHION',
              categoryBn: p.category ?? 'ফ্যাশন',
              priceEn: Number(p.priceEn ?? p.price ?? 0),
              priceBn: (p.priceEn ?? p.price ?? 0).toString().replace(/[0-9]/g, (d: string) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]),
              originalPriceEn: p.original_price ? Number(p.original_price) : undefined,
              originalPriceBn: p.original_price ? p.original_price.toString().replace(/[0-9]/g, (d: string) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]) : undefined,
              descriptionEn: p.descriptionEn ?? p.description ?? '',
              descriptionBn: p.descriptionBn ?? p.description ?? '',
              image: p.image_url ?? p.image ?? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
              sizes: ['S', 'M', 'L', 'XL'],
              fabricEn: p.fabricEn || '100% Quality Material',
              fabricBn: p.fabricBn || '১০০% কোয়ালিটি ফ্যাব্রিক',
              badge: p.badge || (p.cod_available !== false ? 'COD Available' : ''),
              badgeEn: p.badge || 'COD Available',
              badgeBn: p.badge || 'ক্যাশ অন ডেলিভারি',
              isNew: p.is_featured ?? false,
            }));
        }

        // Read local storage cache override
        let cached: any[] = [];
        try {
          const raw = localStorage.getItem('rukhi_products_cache');
          if (raw) cached = JSON.parse(raw);
        } catch (e) {}

        const map = new Map<string, Product>();

        // Start with base list: DB products or local static products
        const baseList = dbProducts.length > 0 ? dbProducts : localProducts;
        baseList.forEach(p => map.set(p.id, p));

        // Overlay cached updates / creations / deletions
        cached.forEach((c: any) => {
          if (c.status === 'hidden' || c.status === 'deleted') {
            map.delete(c.id);
          } else {
            map.set(c.id, {
              id: c.id,
              nameEn: c.nameEn || 'Streetwear Product',
              nameBn: c.nameBn || '',
              category: c.category || 'fashion',
              categoryEn: (c.category || 'fashion').toUpperCase(),
              categoryBn: c.category || 'ফ্যাশন',
              priceEn: Number(c.priceEn || 0),
              priceBn: (c.priceEn || 0).toString().replace(/[0-9]/g, (d: string) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]),
              descriptionEn: c.descriptionEn || '',
              descriptionBn: c.descriptionBn || '',
              image: c.image || c.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
              sizes: ['S', 'M', 'L', 'XL'],
              fabricEn: c.fabricEn || '100% Quality Material',
              fabricBn: c.fabricBn || '১০০% কোয়ালিটি ফ্যাব্রিক',
              badgeEn: c.cod_available ? 'COD Available' : '',
              badgeBn: c.cod_available ? 'ক্যাশ অন ডেলিভারি' : '',
            });
          }
        });

        const finalProductsList = Array.from(map.values());
        setProducts(finalProductsList);

        if (finalProductsList.length > 0 && cartItems.length === 0) {
          setCartItems([
            { product: finalProductsList[0], size: 'L', quantity: 1 },
            { product: finalProductsList[1] || finalProductsList[0], size: '32', quantity: 1 },
          ]);
        }
      } catch (err) {
        console.error('Failed to load dynamic data:', err);
      }
    }
    loadDynamicData();

    // Subscribe to real-time changes on the products table so storefront updates live
    const productsChannel = supabase
      .channel('storefront_products_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          loadDynamicData();
        }
      )
      .subscribe();

    const handleProductsUpdated = () => {
      loadDynamicData();
    };
    window.addEventListener('rukhi-products-updated', handleProductsUpdated);

    return () => {
      supabase.removeChannel(productsChannel);
      window.removeEventListener('rukhi-products-updated', handleProductsUpdated);
    };
  }, []);

  // Supabase Auth Listener
  useEffect(() => {
    async function fetchProfileAndSetUser(user: any) {
      if (!user) return;
      
      let profileData: any = {};
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, phone, address')
          .eq('id', user.id)
          .single();
        if (!error && data) {
          profileData = data;
        }
      } catch (err) {
        console.log('Failed to fetch profile:', err);
      }

      setCurrentUser({
        email: user.email || '',
        name: profileData.username || user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split('@')[0],
        phone: profileData.phone || user.user_metadata?.phone,
        address: profileData.address || user.user_metadata?.address,
      });
    }

    async function checkSupabaseSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          await fetchProfileAndSetUser(data.session.user);
        }
      } catch (err) {
        console.log('Supabase session check error:', err);
      }
    }

    checkSupabaseSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfileAndSetUser(session.user);
      } else if (_event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Modal and Drawer States
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedLookbookPost, setSelectedLookbookPost] = useState<LookbookPost | null>(null);

  // Handlers
  const handleLanguageToggle = () => {
    setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const handleRequestAuth = (onSuccessCallback: () => void, tab: 'login' | 'register' = 'register') => {
    setPendingOrderCallback(() => onSuccessCallback);
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: { email: string; name?: string }) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    if (pendingOrderCallback) {
      pendingOrderCallback();
      setPendingOrderCallback(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddToCart = (product: Product, size: string = 'M', quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, size, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, size: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size))
    );
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] flex flex-col font-sans">
      
      {/* Navbar */}
      <Navbar
        lang={lang}
        onLanguageToggle={handleLanguageToggle}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentUser={currentUser}
        onOpenAuth={(tab) => {
          setAuthInitialTab(tab || 'register');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Sections with React Router */}
      <main className="flex-grow">
        <Routes>
          {/* Home Page Route */}
          <Route
            path="/"
            element={
              <>
                {/* Section 2: Hero Carousel */}
                <Hero lang={lang} />

                {/* Section 3: Shop by Category & Category Filter Bar */}
                <CategorySection
                  lang={lang}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => setSelectedCategory(cat)}
                />

                {/* Section 4: Best Sellers */}
                <BestSellers
                  lang={lang}
                  products={products}
                  selectedCategory={selectedCategory}
                  onSelectCategoryFilter={(cat) => setSelectedCategory(cat)}
                  onAddToCart={handleAddToCart}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />

                {/* Section 5: Why Shop With Us */}
                <WhyUs lang={lang} />

                {/* Section 6: About */}
                <AboutSection lang={lang} />

                {/* Section 7: The Lookbook */}
                <LookbookSection
                  lang={lang}
                  onSelectPost={(post) => setSelectedLookbookPost(post)}
                />
              </>
            }
          />

          {/* All Departments / Categories Overview Route */}
          <Route
            path="/categories"
            element={
              <CategoriesPage
                lang={lang}
                products={products}
                onOpenQuickView={(prod) => setQuickViewProduct(prod)}
              />
            }
          />

          {/* Dedicated Category Page Route */}
          <Route
            path="/category/:categoryId"
            element={
              <CategoryDetailPage
                lang={lang}
                products={products}
                onAddToCart={handleAddToCart}
                onOpenQuickView={(prod) => setQuickViewProduct(prod)}
              />
            }
          />

          {/* Dedicated Terms and Conditions & Policies Hub Routes */}
          <Route
            path="/terms"
            element={<TermsPage lang={lang} storeSettings={storeSettings} />}
          />
          <Route
            path="/terms-and-conditions"
            element={<TermsPage lang={lang} storeSettings={storeSettings} />}
          />
          <Route
            path="/policy/:type"
            element={<TermsPage lang={lang} storeSettings={storeSettings} />}
          />

          {/* Catch-all fallback */}
          <Route
            path="*"
            element={
              <>
                <Hero lang={lang} />
                <CategorySection
                  lang={lang}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => setSelectedCategory(cat)}
                />
                <BestSellers
                  lang={lang}
                  products={products}
                  selectedCategory={selectedCategory}
                  onSelectCategoryFilter={(cat) => setSelectedCategory(cat)}
                  onAddToCart={handleAddToCart}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
                <WhyUs lang={lang} />
                <AboutSection lang={lang} />
                <LookbookSection
                  lang={lang}
                  onSelectPost={(post) => setSelectedLookbookPost(post)}
                />
              </>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        storeSettings={storeSettings}
        onOpenPolicy={handleOpenPolicy}
      />

      {/* Policy Document Modal */}
      <PolicyModal
        isOpen={policyModal.isOpen}
        onClose={() => setPolicyModal({ ...policyModal, isOpen: false })}
        title={policyModal.title}
        type={policyModal.type}
        content={policyModal.content}
        lang={lang}
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        lang={lang}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* COD Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        lang={lang}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
        currentUser={currentUser}
        onRequestAuth={handleRequestAuth}
      />

      {/* Email Login/Register Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingOrderCallback(null);
        }}
        lang={lang}
        cartItems={cartItems}
        onAuthSuccess={handleAuthSuccess}
        initialTab={authInitialTab}
      />

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        lang={lang}
        onAddToCart={handleAddToCart}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        lang={lang}
        products={products}
        onSelectProduct={(prod) => setQuickViewProduct(prod)}
      />

      {/* Lookbook Full Article Modal */}
      <LookbookModal
        post={selectedLookbookPost}
        onClose={() => setSelectedLookbookPost(null)}
        lang={lang}
      />

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton
        lang={lang}
        cartItems={cartItems}
        currentUser={currentUser}
      />

    </div>
  );
}
