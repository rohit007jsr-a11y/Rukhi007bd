import React from 'react';
import { ArrowRight, Sparkles, Factory, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const t = translations[lang].about;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image with Offset Red Panel Behind It for Depth */}
          <div className="lg:col-span-5 relative">
            {/* Offset Red Panel */}
            <div className="absolute inset-0 bg-[#E63946] rounded-2xl border-2 border-[#111111] transform translate-x-4 translate-y-4 sm:translate-x-6 sm:translate-y-6 shadow-[6px_6px_0px_#111111]" />

            {/* Main Image Container */}
            <div className="relative rounded-2xl border-2 border-[#111111] overflow-hidden bg-[#111111] shadow-[8px_8px_0px_#111111] aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
                alt="Rukhi Quality Assurance & Fulfillment"
                className="w-full h-full object-cover filter contrast-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Floating Badge Over Image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#E63946] text-white rounded-lg border border-[#111111]">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={`block text-xs font-black uppercase text-[#111111] ${headingFontClass}`}>
                      {t.statsMills}
                    </span>
                    <span className={`text-xs text-gray-600 font-medium ${bodyFontClass}`}>
                      {t.statsMillsLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0EDEA] border border-[#111111] rounded shadow-[2px_2px_0px_#111111] w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
              <span className={`text-xs font-black uppercase tracking-wider text-[#111111] ${bodyFontClass}`}>
                {lang === 'en' ? 'OUR HERITAGE & MISSION' : 'আমাদের ঐতিহ্য ও লক্ষ্য'}
              </span>
            </div>

            {/* Title */}
            <h2 className={`text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-tight mb-6 ${headingFontClass}`}>
              {t.title}
            </h2>

            {/* Subtitle */}
            <p className={`text-base sm:text-xl font-bold text-[#E63946] mb-6 leading-relaxed ${bodyFontClass}`}>
              {t.subtitle}
            </p>

            {/* Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-[#4B5563] leading-relaxed mb-8">
              <p className={`p-4 bg-[#F7F7F5] rounded-xl border-l-4 border-[#111111] ${bodyFontClass}`}>
                {t.para1}
              </p>
              <p className={`p-4 bg-[#F7F7F5] rounded-xl border-l-4 border-[#E63946] ${bodyFontClass}`}>
                {t.para2}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-8 pt-4 border-t border-gray-200">
              <div className="p-3 bg-[#F0EDEA] rounded-lg border border-[#111111]">
                <span className={`text-xl sm:text-2xl font-black text-[#111111] block ${headingFontClass}`}>
                  100%
                </span>
                <span className={`text-xs text-gray-600 ${bodyFontClass}`}>
                  {t.statsMillsLabel}
                </span>
              </div>
              <div className="p-3 bg-[#F0EDEA] rounded-lg border border-[#111111]">
                <span className={`text-xl sm:text-2xl font-black text-[#E63946] block ${headingFontClass}`}>
                  64
                </span>
                <span className={`text-xs text-gray-600 ${bodyFontClass}`}>
                  {t.statsDistrictsLabel}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <a
                href="#bestsellers"
                className={`inline-flex items-center gap-3 px-8 py-4 bg-[#111111] text-white font-extrabold text-sm uppercase tracking-wider rounded border-2 border-[#111111] shadow-[5px_5px_0px_#E63946] hover:shadow-[2px_2px_0px_#E63946] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer ${bodyFontClass}`}
              >
                <span>{t.cta}</span>
                <ArrowRight className="w-5 h-5 text-[#E63946]" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
