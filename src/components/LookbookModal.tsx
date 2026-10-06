import React from 'react';
import { X, Calendar, Tag, BookOpen } from 'lucide-react';
import { Language, LookbookPost } from '../types';
import { translations } from '../translations';

interface LookbookModalProps {
  post: LookbookPost | null;
  onClose: () => void;
  lang: Language;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  post,
  onClose,
  lang,
}) => {
  if (!post) return null;

  const t = translations[lang].lookbook;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const paragraphs = lang === 'en' ? post.contentEn : post.contentBn;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border-2 border-[#111111] max-w-2xl w-full shadow-[6px_6px_0px_#111111] sm:shadow-[10px_10px_0px_#111111] overflow-hidden my-4 sm:my-8 relative max-h-[92vh] flex flex-col">
        
        {/* Header Image */}
        <div className="relative aspect-[16/9] max-h-52 sm:max-h-72 bg-black shrink-0">
          <img
            src={post.image}
            alt={lang === 'en' ? post.titleEn : post.titleBn}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 sm:p-2 bg-white text-[#111111] hover:text-[#E63946] rounded-full border border-[#111111] shadow-[2px_2px_0px_#111111] cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 text-white">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#E63946] text-white text-[9px] sm:text-[10px] font-black uppercase rounded border border-white/20 mb-1 sm:mb-2 inline-block">
              {lang === 'en' ? post.tagEn : post.tagBn}
            </span>
            <h2 className={`text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight ${headingFontClass}`}>
              {lang === 'en' ? post.titleEn : post.titleBn}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold text-gray-500 border-b pb-3 sm:pb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E63946]" />
              {lang === 'en' ? post.dateEn : post.dateBn}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E63946]" />
              {lang === 'en' ? '3 Min Read' : '৩ মিনিট পাঠ'}
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4 text-xs sm:text-base text-[#4B5563] leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx} className={`p-3 sm:p-4 bg-[#F7F7F5] rounded-xl border-l-4 border-[#111111] ${bodyFontClass}`}>
                {p}
              </p>
            ))}
          </div>

          <button
            onClick={onClose}
            className={`w-full py-2.5 sm:py-3 bg-[#111111] text-white font-extrabold text-xs uppercase rounded border border-[#111111] shadow-[3px_3px_0px_#E63946] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer ${bodyFontClass}`}
          >
            {t.closeArticle}
          </button>
        </div>

      </div>
    </div>
  );
};
