import React from 'react';
import { Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { Language, LookbookPost } from '../types';
import { translations } from '../translations';
import { lookbookPosts } from '../data/products';

interface LookbookSectionProps {
  lang: Language;
  onSelectPost: (post: LookbookPost) => void;
}

export const LookbookSection: React.FC<LookbookSectionProps> = ({
  lang,
  onSelectPost,
}) => {
  const t = translations[lang].lookbook;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  return (
    <section id="lookbook" className="py-24 bg-white border-t-2 border-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Split Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 pb-6 border-b-2 border-[#111111]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#E63946]" />
              <span className={`text-xs font-bold uppercase tracking-widest text-[#E63946] ${bodyFontClass}`}>
                {lang === 'en' ? 'GUIDES & UPDATES' : 'গাইড ও আপডেট'}
              </span>
            </div>
            <h2 className={`text-3xl sm:text-5xl font-black text-[#111111] tracking-tight ${headingFontClass}`}>
              {t.title}
            </h2>
          </div>

          <p className={`text-base text-[#6B7280] max-w-md ${bodyFontClass}`}>
            {t.subtitle}
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lookbookPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group flex flex-col bg-[#F7F7F5] rounded-xl border-2 border-[#111111] overflow-hidden shadow-[5px_5px_0px_#111111] hover:shadow-[8px_8px_0px_#E63946] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
            >
              {/* Image Container Aspect 3:2 */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-black">
                <img
                  src={post.image}
                  alt={lang === 'en' ? post.titleEn : post.titleBn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Top-Left Badge / Date Overlay */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#111111] text-white text-[10px] font-black uppercase tracking-wider rounded border border-white/20 shadow-sm flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#E63946]" />
                    {lang === 'en' ? post.tagEn : post.tagBn}
                  </span>
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#111111] text-[10px] font-bold rounded border border-[#111111] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    {lang === 'en' ? post.dateEn : post.dateBn}
                  </span>
                </div>
              </div>

              {/* Content Box */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-black text-[#111111] group-hover:text-[#E63946] transition-colors leading-snug mb-3 ${headingFontClass}`}
                  >
                    {lang === 'en' ? post.titleEn : post.titleBn}
                  </h3>
                  <p className={`text-sm text-[#6B7280] leading-relaxed mb-6 line-clamp-2 ${bodyFontClass}`}>
                    {lang === 'en' ? post.excerptEn : post.excerptBn}
                  </p>
                </div>

                {/* Read Button */}
                <div className="pt-4 border-t border-gray-200">
                  <span
                    className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#111111] group-hover:text-[#E63946] transition-colors ${bodyFontClass}`}
                  >
                    <span>{t.readMore}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
