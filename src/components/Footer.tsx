import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang].footer;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t-4 border-[#E63946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* COD Top Ticker Banner */}
        <div className="p-4 bg-[#E63946] rounded-xl border-2 border-white mb-12 shadow-[4px_4px_0px_#FFFFFF] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-white shrink-0" />
            <div>
              <span className={`text-sm sm:text-base font-black text-white uppercase block ${headingFontClass}`}>
                {t.codBanner}
              </span>
              <span className={`text-xs text-white/90 ${bodyFontClass}`}>
                {lang === 'en'
                  ? 'No advance payment required. Inspect parcel before paying.'
                  : 'কোনো ধরনের অগ্রিম পেমেন্ট লাগবে না। পার্সেল দেখে নিশ্চিত হয়ে মূল্য পরিশোধ করুন।'}
              </span>
            </div>
          </div>
          <a
            href="#bestsellers"
            className={`px-5 py-2.5 bg-white text-[#111111] font-extrabold text-xs uppercase rounded border border-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer whitespace-nowrap ${bodyFontClass}`}
          >
            {lang === 'en' ? 'Order Now (COD)' : 'এখনই অর্ডার করুন (COD)'}
          </a>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="inline-block">
              <span className="font-heading-en tracking-tighter text-3xl font-black text-[#111111] bg-white px-2.5 py-1 shadow-[3px_3px_0px_#E63946] border border-white">
                RUKHI
              </span>
            </a>
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
                <a href="#categories" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Categories' : 'ক্যাটাগরি'}
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Best Sellers' : 'সেরা বিক্রি হওয়া পণ্য'}
                </a>
              </li>
              <li>
                <a href="#whyus" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Why Rukhi' : 'কেন রুখি'}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Our Story' : 'আমাদের গল্প'}
                </a>
              </li>
              <li>
                <a href="#lookbook" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Guides & Updates' : 'গাইড ও আপডেট'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care */}
          <div>
            <h3 className={`text-xs font-black uppercase tracking-widest text-[#E63946] mb-4 ${bodyFontClass}`}>
              {t.customerCare}
            </h3>
            <ul className={`space-y-2.5 text-sm text-gray-300 ${bodyFontClass}`}>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'COD Policy' : 'ক্যাশ অন ডেলিভারি নীতি'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {lang === 'en' ? '7-Day Return Policy' : '৭ দিনের রিটার্ন নীতি'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Size Guide' : 'সাইজ গাইড'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Track Order' : 'অর্ডার ট্র্যাক করুন'}
                </a>
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
                <span>{t.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E63946] shrink-0" />
                <span>{t.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E63946] shrink-0" />
                <span>{t.email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p className={bodyFontClass}>{t.rights}</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-900 border border-gray-800 text-[10px] font-extrabold text-white rounded">
              CASH ON DELIVERY (ক্যাশ অন ডেলিভারি)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
