import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Search, ShoppingBag, User, LogOut, Menu, X, ChevronDown, Shirt, Tv, Utensils, Sparkles, ShoppingBasket, Smartphone, FileText } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  lang: Language;
  onLanguageToggle: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  currentUser: { email: string; name?: string } | null;
  onOpenAuth: (tab?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageToggle,
  cartCount,
  onOpenCart,
  onOpenSearch,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const location = useLocation();
  const t = translations[lang].nav;
  const authT = translations[lang].auth;

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // On non-homepage views (e.g. /category/fashion, /terms), use white navbar with black text by default
  const isNavbarLight = isScrolled || !isHomePage;

  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const categoryItems = [
    { id: 'fashion', labelEn: 'Fashion & Apparel', labelBn: 'ফ্যাশন ও পোশাক', icon: Shirt },
    { id: 'electronics', labelEn: 'Electronics & Audio', labelBn: 'ইলেকট্রনিক্স ও অডিও', icon: Tv },
    { id: 'home_kitchen', labelEn: 'Home & Kitchen', labelBn: 'হোম ও কিচেন', icon: Utensils },
    { id: 'beauty', labelEn: 'Beauty & Care', labelBn: 'বিউটি ও কেয়ার', icon: Sparkles },
    { id: 'groceries', labelEn: 'Organic Groceries', labelBn: 'অর্গানিক গ্রোসারি', icon: ShoppingBasket },
    { id: 'gadgets', labelEn: 'Gadgets & Tools', labelBn: 'গ্যাজেটস ও এক্সেসরিজ', icon: Smartphone },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isNavbarLight
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 sm:py-3.5 text-[#111111] border-b border-gray-200'
          : 'bg-transparent py-3 sm:py-6 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo - Always "RUKHI" in Latin script */}
        <Link
          to="/"
          className="flex items-center gap-2 group focus:outline-none shrink-0"
        >
          <span className="font-heading-en tracking-tighter text-xl sm:text-3xl font-black text-[#111111] bg-white px-2 sm:px-2.5 py-0.5 shadow-[2px_2px_0px_#E63946] sm:shadow-[3px_3px_0px_#E63946] border border-[#111111] transform -rotate-1 group-hover:rotate-0 transition-transform">
            RUKHI
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link
            to="/"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass} ${location.pathname === '/' ? 'text-[#E63946]' : ''}`}
          >
            {t.shop}
          </Link>

          {/* Categories with Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setCategoriesDropdownOpen(true)}
            onMouseLeave={() => setCategoriesDropdownOpen(false)}
          >
            <Link
              to="/categories"
              className={`flex items-center gap-1 text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors py-2 ${bodyFontClass} ${location.pathname.startsWith('/categor') ? 'text-[#E63946]' : ''}`}
            >
              <span>{t.categories}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </Link>

            {/* Dropdown Menu */}
            {categoriesDropdownOpen && (
              <div className="absolute top-full left-0 mt-0 w-64 bg-white border-2 border-[#111111] rounded-xl shadow-[6px_6px_0px_#111111] p-2 text-[#111111] animate-in fade-in duration-150 z-50">
                <div className="p-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                    {lang === 'en' ? 'DEPARTMENTS' : 'সকল ডিপার্টমেন্ট'}
                  </span>
                  <Link
                    to="/categories"
                    className="text-[10px] font-bold text-[#E63946] hover:underline"
                    onClick={() => setCategoriesDropdownOpen(false)}
                  >
                    {lang === 'en' ? 'View All' : 'সব দেখুন'}
                  </Link>
                </div>
                <div className="space-y-1 mt-1">
                  {categoryItems.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold text-gray-800 hover:bg-[#F7F7F5] hover:text-[#E63946] transition-colors"
                      >
                        <div className="p-1 bg-gray-100 rounded text-gray-700">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{lang === 'en' ? cat.labelEn : cat.labelBn}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <a
            href="/#bestsellers"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass}`}
          >
            {t.bestSellers}
          </a>
          <a
            href="/#whyus"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass}`}
          >
            {t.whyUs}
          </a>
          <a
            href="/#about"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass}`}
          >
            {t.about}
          </a>
          <a
            href="/#lookbook"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass}`}
          >
            {t.lookbook}
          </a>
          <Link
            to="/terms"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass} ${location.pathname.startsWith('/terms') ? 'text-[#E63946]' : ''}`}
          >
            {lang === 'en' ? 'Policies' : 'পলিসি'}
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-4">
          {/* Language Toggle Pill */}
          <button
            onClick={onLanguageToggle}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase rounded-full border border-[#111111] transition-all duration-200 cursor-pointer shadow-[2px_2px_0px_#111111] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${
              isNavbarLight ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-[#111111] border-[#111111]'
            }`}
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#E63946]" />
            <span className={lang === 'en' ? 'font-body-bn' : 'font-body-en'}>
              {lang === 'en' ? 'বাংলা' : 'English'}
            </span>
          </button>

          {/* User Account / Auth Button */}
          {currentUser ? (
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border border-[#111111] transition-all cursor-pointer shadow-[2px_2px_0px_#111111] bg-white text-[#111111]"
                title={currentUser.email}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="max-w-[100px] truncate">{currentUser.name || currentUser.email.split('@')[0]}</span>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-[#111111] rounded-xl shadow-[4px_4px_0px_#111111] p-2 hidden group-hover:block transition-all z-50 text-[#111111]">
                <div className="p-2 border-b border-gray-100 text-xs">
                  <p className="text-gray-500 text-[10px] uppercase font-bold">{authT.loggedInAs}</p>
                  <p className="font-extrabold truncate text-[#111111]">{currentUser.email}</p>
                </div>
                <Link
                  to="/terms"
                  className="w-full flex items-center gap-2 p-2 mt-1 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>{lang === 'en' ? 'Store Policies' : 'শর্তাবলী ও পলিসি'}</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 p-2 mt-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{authT.logout}</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isNavbarLight
                  ? 'hover:bg-gray-100 text-[#111111]'
                  : 'hover:bg-white/20 text-white'
              }`}
              aria-label="Login or Register"
              title={authT.titleLogin}
            >
              <User className="w-5 h-5" />
            </button>
          )}

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isNavbarLight
                ? 'hover:bg-gray-100 text-[#111111]'
                : 'hover:bg-white/20 text-white'
            }`}
            aria-label="Search products"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Icon with Red Badge */}
          <button
            onClick={onOpenCart}
            className={`relative p-2 rounded-full transition-transform active:scale-95 cursor-pointer ${
              isNavbarLight ? 'text-[#111111]' : 'text-white'
            }`}
            aria-label="Shopping Bag"
          >
            <div className="p-2 bg-white text-[#111111] border border-[#111111] rounded-full shadow-[2px_2px_0px_#E63946]">
              <ShoppingBag className="w-5 h-5 text-[#111111]" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E63946] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              isNavbarLight ? 'text-[#111111]' : 'text-white'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#111111]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-[#111111] border-b-2 border-[#111111] px-5 py-5 shadow-2xl space-y-4 animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            {currentUser ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-[#111111] max-w-[140px] truncate">{currentUser.email}</span>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="text-xs text-red-600 font-bold underline ml-2 cursor-pointer"
                >
                  {authT.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                className="flex items-center gap-1.5 text-xs font-bold text-[#E63946] border border-[#E63946] px-3 py-1 rounded cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{authT.titleLogin}</span>
              </button>
            )}
            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-1 px-3 py-1 bg-[#111111] text-white text-xs font-bold rounded shadow-[2px_2px_0px_#E63946]"
            >
              <Globe className="w-3.5 h-3.5 text-[#E63946]" />
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>

          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-bold text-[#111111] hover:text-[#E63946] py-1.5 flex items-center justify-between ${bodyFontClass}`}
            >
              <span>{t.shop}</span>
              <span className="text-[10px] text-gray-400 font-mono">HOME</span>
            </Link>

            {/* Mobile Categories Accordion */}
            <div className="py-2 border-y border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-gray-500 tracking-wider">
                  {lang === 'en' ? 'CATEGORIES' : 'ক্যাটাগরি সমূহ'}
                </span>
                <Link
                  to="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-[#E63946]"
                >
                  {lang === 'en' ? 'View All' : 'সব দেখুন'}
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {categoryItems.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-2 bg-[#F7F7F5] rounded-lg border border-gray-200 text-xs font-bold text-gray-800 hover:border-[#E63946]"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#E63946]" />
                      <span className="truncate">{lang === 'en' ? cat.labelEn : cat.labelBn}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <a
              href="/#bestsellers"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-bold text-[#111111] hover:text-[#E63946] py-1.5 ${bodyFontClass}`}
            >
              {t.bestSellers}
            </a>
            <a
              href="/#whyus"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-bold text-[#111111] hover:text-[#E63946] py-1.5 ${bodyFontClass}`}
            >
              {t.whyUs}
            </a>
            <a
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-bold text-[#111111] hover:text-[#E63946] py-1.5 ${bodyFontClass}`}
            >
              {t.about}
            </a>
            <a
              href="/#lookbook"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-bold text-[#111111] hover:text-[#E63946] py-1.5 ${bodyFontClass}`}
            >
              {t.lookbook}
            </a>

            {/* Terms and policies link in mobile menu */}
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
              <Link
                to="/terms"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs font-bold text-[#111111] hover:text-[#E63946] py-1 flex items-center justify-between ${bodyFontClass}`}
              >
                <span>{lang === 'en' ? 'Terms & Conditions' : 'শর্তাবলী ও নিয়মাবলী'}</span>
                <span className="text-[10px] text-[#E63946] font-mono">LEGAL</span>
              </Link>
              <Link
                to="/terms?tab=cod"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs font-bold text-gray-600 hover:text-[#E63946] py-1 ${bodyFontClass}`}
              >
                {lang === 'en' ? 'Cash on Delivery Policy' : 'ক্যাশ অন ডেলিভারি নীতি'}
              </Link>
              <Link
                to="/terms?tab=return"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs font-bold text-gray-600 hover:text-[#E63946] py-1 ${bodyFontClass}`}
              >
                {lang === 'en' ? '7-Day Return & Replacement' : '৭ দিনের রিটার্ন নীতি'}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

