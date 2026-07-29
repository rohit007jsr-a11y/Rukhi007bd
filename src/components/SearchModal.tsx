import React, { useState } from 'react';
import { X, Search, ShoppingBag } from 'lucide-react';
import { Language, Product } from '../types';
import { translations } from '../translations';
import { products } from '../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const t = translations[lang].search;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const results = products.filter((p) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      p.nameEn.toLowerCase().includes(q) ||
      p.nameBn.toLowerCase().includes(q) ||
      p.categoryEn.toLowerCase().includes(q) ||
      p.categoryBn.toLowerCase().includes(q) ||
      p.descriptionEn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl border-2 border-[#111111] max-w-2xl w-full shadow-[10px_10px_0px_#111111] overflow-hidden animate-in fade-in slide-in-from-top-10 duration-200">
        
        {/* Search Header */}
        <div className="p-4 bg-[#F7F7F5] border-b-2 border-[#111111] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#E63946]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            autoFocus
            className={`w-full bg-transparent text-base sm:text-lg font-bold text-[#111111] focus:outline-none ${bodyFontClass}`}
          />
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-[#E63946] rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="text-center py-8">
              <span className={`text-xs font-bold text-gray-400 block mb-3 ${bodyFontClass}`}>
                {t.popularTags}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {['Denim', 'Cotton Tee', 'Corduroy', 'Trouser'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-[#F0EDEA] text-[#111111] text-xs font-extrabold rounded border border-[#111111] hover:bg-[#E63946] hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className={`text-sm font-bold ${bodyFontClass}`}>{t.noResults}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="flex items-center gap-4 p-3 bg-[#F7F7F5] rounded-xl border border-[#111111] hover:bg-white hover:shadow-[3px_3px_0px_#E63946] transition-all cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={lang === 'en' ? product.nameEn : product.nameBn}
                    className="w-14 h-16 object-cover rounded border border-[#111111]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h4 className={`text-sm font-extrabold text-[#111111] ${headingFontClass}`}>
                      {lang === 'en' ? product.nameEn : product.nameBn}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {lang === 'en' ? product.categoryEn : product.categoryBn}
                    </span>
                  </div>
                  <span className={`text-sm font-black text-[#E63946] ${headingFontClass}`}>
                    {lang === 'en' ? `৳ ${product.priceEn}` : product.priceBn}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
