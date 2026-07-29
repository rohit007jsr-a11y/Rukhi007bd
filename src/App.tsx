/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, CartItem, Product, LookbookPost } from './types';
import { products } from './data/products';
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
import { WhatsAppButton } from './components/WhatsAppButton';

export default function App() {
  // Language State - default 'en'
  const [lang, setLang] = useState<Language>('en');

  // User Auth State
  const [currentUser, setCurrentUser] = useState<{ email: string; name?: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('register');
  const [pendingOrderCallback, setPendingOrderCallback] = useState<(() => void) | null>(null);

  // Seed cart initialized with 2 items so cart badge starts at 2 as requested in prompt!
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: products[0], size: 'L', quantity: 1 },
    { product: products[1], size: '32', quantity: 1 },
  ]);

  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Supabase Auth Listener
  useEffect(() => {
    async function checkSupabaseSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const user = data.session.user;
          setCurrentUser({
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email?.split('@')[0],
          });
        }
      } catch (err) {
        console.log('Supabase session check error:', err);
      }
    }

    checkSupabaseSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
        });
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

      {/* Main Content Sections */}
      <main className="flex-grow">
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
      </main>

      {/* Footer */}
      <Footer lang={lang} />

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
