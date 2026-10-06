import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface FooterProps {
  lang: Language;
  storeSettings?: Record<string, any>;
  onOpenPolicy?: (type: 'cod' | 'return' | 'size' | 'track') => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, storeSettings = {} as Record<string, any>, onOpenPolicy }) => {
  const t = translations[lang].footer;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const addressText = storeSettings?.address || t.address;
  const phoneText = storeSettings?.contactPhone || t.phone;
  const emailText = storeSettings?.contactEmail || t.email;

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t-4 border-[#E63946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* COD Top Ticker Banner */}
        <div className="p-3.5 sm:p-4 bg-[#E63946] rounded-xl border-2 border-white mb-8 sm:mb-12 shadow-[3px_3px_0px_#FFFFFF] sm:shadow-[4px_4px_0px_#FFFFFF] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white shrink-0" />
            <div>
              <span className={`text-xs sm:text-base font-black text-white uppercase block ${headingFontClass}`}>
                {t.codBanner}
              </span>
              <span className={`text-[11px] sm:text-xs text-white/90 ${bodyFontClass}`}>
                {lang === 'en'
                  ? 'No advance payment required. Inspect parcel before paying.'
                  : 'কোনো ধরনের অগ্রিম পেমেন্ট লাগবে না। পার্সেল দেখে নিশ্চিত হয়ে মূল্য পরিশোধ করুন।'}
              </span>
            </div>
          </div>
          <Link
            to="/categories"
            className={`w-full sm:w-auto text-center px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-[#111111] font-extrabold text-[11px] sm:text-xs uppercase rounded border border-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer whitespace-nowrap ${bodyFontClass}`}
          >
            {lang === 'en' ? 'Explore Catalog (COD)' : 'ক্যাটালগ দেখুন (COD)'}
          </Link>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-gray-800">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-heading-en tracking-tighter text-3xl font-black text-[#111111] bg-white px-2.5 py-1 shadow-[3px_3px_0px_#E63946] border border-white">
                RUKHI
              </span>
            </Link>
            <p className={`text-sm text-gray-400 max-w-sm leading-relaxed ${bodyFontClass}`}>
              {t.tagline}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="p-2 bg-gray-900 hover:bg-[#E63946] rounded-lg border border-gray-800 transition-colors text-white" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-900 hover:bg-[#E63946] rounded-lg border border-gray-800 transition-colors text-white" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-900 hover:bg-[#E63946] rounded-lg border border-gray-800 transition-colors text-white" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className={`text-xs font-black uppercase tracking-widest text-[#E63946] mb-4 ${bodyFontClass}`}>
              {t.quickLinks}
            </h3>
            <ul className={`space-y-2.5 text-sm text-gray-300 ${bodyFontClass}`}>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'All Departments' : 'সকল ডিপার্টমেন্ট'}
                </Link>
              </li>
              <li>
                <Link to="/category/fashion" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Fashion Apparel' : 'ফ্যাশন পোশাক'}
                </Link>
              </li>
              <li>
                <Link to="/category/electronics" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Electronics & Audio' : 'ইলেকট্রনিক্স ও অডিও'}
                </Link>
              </li>
              <li>
                <Link to="/category/home_kitchen" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Home & Kitchen' : 'হোম ও কিচেন'}
                </Link>
              </li>
              <li>
                <a href="/#bestsellers" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Best Sellers' : 'সেরা বিক্রি হওয়া পণ্য'}
                </a>
              </li>
              <li>
                <a href="/#lookbook" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Guides & Updates' : 'গাইড ও আপডেট'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care & Policies */}
          <div>
            <h3 className={`text-xs font-black uppercase tracking-widest text-[#E63946] mb-4 ${bodyFontClass}`}>
              {t.customerCare}
            </h3>
            <ul className={`space-y-2.5 text-sm text-gray-300 ${bodyFontClass}`}>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors text-left block">
                  {lang === 'en' ? 'Terms & Conditions' : 'শর্তাবলী ও নিয়মাবলী'}
                </Link>
              </li>
              <li>
                <Link to="/terms?tab=cod" className="hover:text-white transition-colors text-left block">
                  {lang === 'en' ? 'COD Policy' : 'ক্যাশ অন ডেলিভারি নীতি'}
                </Link>
              </li>
              <li>
                <Link to="/terms?tab=return" className="hover:text-white transition-colors text-left block">
                  {lang === 'en' ? '7-Day Return Policy' : '৭ দিনের রিটার্ন নীতি'}
                </Link>
              </li>
              <li>
                <Link to="/terms?tab=shipping" className="hover:text-white transition-colors text-left block">
                  {lang === 'en' ? 'Shipping & Delivery' : 'শিপিং ও ডেলিভারি'}
                </Link>
              </li>
              <li>
                <Link to="/terms?tab=privacy" className="hover:text-white transition-colors text-left block">
                  {lang === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('size')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {lang === 'en' ? 'Size Guide' : 'সাইজ গাইড'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div>
            <h3 className={`text-xs font-black uppercase tracking-widest text-[#E63946] mb-4 ${bodyFontClass}`}>
              {t.contactUs}
            </h3>
            <ul className={`space-y-3 text-xs text-gray-300 ${bodyFontClass}`}>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
                <span>{addressText}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E63946] shrink-0" />
                <span>{phoneText}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E63946] shrink-0" />
                <span>{emailText}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Policy Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p className={bodyFontClass}>{t.rights}</p>
          <div className="flex items-center gap-3">
            <Link to="/terms" className="hover:text-gray-300 transition-colors">
              Terms
            </Link>
            <span>&middot;</span>
            <Link to="/terms?tab=privacy" className="hover:text-gray-300 transition-colors">
              Privacy
            </Link>
            <span>&middot;</span>
            <span className="px-2 py-1 bg-gray-900 border border-gray-800 text-[10px] font-extrabold text-white rounded">
              CASH ON DELIVERY (ক্যাশ অন ডেলিভারি)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

