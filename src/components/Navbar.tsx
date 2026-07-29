import React, { useState, useEffect } from 'react';
import { Globe, Search, ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
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
  const t = translations[lang].nav;
  const authT = translations[lang].auth;

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

  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm py-4 text-[#111111]'
          : 'bg-transparent py-6 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo - Always "RUKHI" in Latin script */}
        <a
          href="#"
          className="flex items-center gap-2 group focus:outline-none"
        >
          <span className="font-heading-en tracking-tighter text-2xl sm:text-3xl font-black text-[#111111] bg-white px-2.5 py-0.5 shadow-[3px_3px_0px_#E63946] border border-[#111111] transform -rotate-1 group-hover:rotate-0 transition-transform">
            RUKHI
          </span>
        </a>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#categories"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass}`}
          >
            {t.categories}
          </a>
          <a
            href="#bestsellers"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass}`}
          >
            {t.bestSellers}
          </a>
          <a
            href="#whyus"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass}`}
          >
            {t.whyUs}
          </a>
          <a
            href="#about"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass}`}
          >
            {t.about}
          </a>
          <a
            href="#lookbook"
            className={`text-sm font-semibold tracking-wide hover:text-[#E63946] transition-colors ${bodyFontClass}`}
          >
            {t.lookbook}
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Language Toggle Pill */}
          <button
            onClick={onLanguageToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase rounded-full border border-[#111111] transition-all duration-200 cursor-pointer shadow-[2px_2px_0px_#111111] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] ${
              isScrolled ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-[#111111] border-[#111111]'
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
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border border-[#111111] transition-all cursor-pointer shadow-[2px_2px_0px_#111111] ${
                  isScrolled ? 'bg-white text-[#111111]' : 'bg-white text-[#111111]'
                }`}
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
                isScrolled
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
              isScrolled
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
              isScrolled ? 'text-[#111111]' : 'text-white'
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
              isScrolled ? 'text-[#111111]' : 'text-white'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#111111]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-[#111111] border-b border-[#111111] px-6 py-6 shadow-xl space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            {currentUser ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-[#111111]">{currentUser.email}</span>
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
          <nav className="flex flex-col space-y-3">
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-bold text-[#111111] hover:text-[#E63946] py-1 ${bodyFontClass}`}
            >
              {t.categories}
            </a>
            <a
              href="#bestsellers"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-bold text-[#111111] hover:text-[#E63946] py-1 ${bodyFontClass}`}
            >
              {t.bestSellers}
            </a>
            <a
              href="#whyus"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-bold text-[#111111] hover:text-[#E63946] py-1 ${bodyFontClass}`}
            >
              {t.whyUs}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-bold text-[#111111] hover:text-[#E63946] py-1 ${bodyFontClass}`}
            >
              {t.about}
            </a>
            <a
              href="#lookbook"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-bold text-[#111111] hover:text-[#E63946] py-1 ${bodyFontClass}`}
            >
              {t.lookbook}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
