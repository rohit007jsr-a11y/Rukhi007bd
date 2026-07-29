import React from 'react';
import { Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface WhyUsProps {
  lang: Language;
}

export const WhyUs: React.FC<WhyUsProps> = ({ lang }) => {
  const t = translations[lang].whyUs;
  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const features = [
    {
      icon: ShieldCheck,
      titleKey: 'feature1Title' as const,
      descKey: 'feature1Desc' as const,
      badgeEn: '0% ADVANCE',
      badgeBn: 'কোনো অগ্রিম পেমেন্ট নেই',
    },
    {
      icon: Truck,
      titleKey: 'feature2Title' as const,
      descKey: 'feature2Desc' as const,
      badgeEn: '64 DISTRICTS',
      badgeBn: '৬৪ জেলায় ডেলিভারি',
    },
    {
      icon: RefreshCw,
      titleKey: 'feature3Title' as const,
      descKey: 'feature3Desc' as const,
      badgeEn: '7 DAYS EASY',
      badgeBn: '৭ দিনের সহজ এক্সচেঞ্জ',
    },
  ];

  return (
    <section id="whyus" className="py-20 bg-[#F7F7F5] border-y-2 border-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#111111] bg-[#E63946] text-white px-3 py-1 rounded border border-[#111111] shadow-[2px_2px_0px_#111111] inline-block mb-3">
            {lang === 'en' ? 'ZERO RISK GUARANTEE' : '১০০% নিশ্চিত সুবিধা'}
          </span>
          <h2 className={`text-3xl sm:text-5xl font-black text-[#111111] tracking-tight mb-4 ${headingFontClass}`}>
            {t.title}
          </h2>
          <p className={`text-base sm:text-lg text-[#6B7280] ${bodyFontClass}`}>
            {t.subtitle}
          </p>
        </div>

        {/* 3-Column Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-8 bg-white rounded-2xl border-2 border-[#111111] shadow-[6px_6px_0px_#111111] hover:shadow-[8px_8px_0px_#E63946] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Signature Icon in White Circle with 3D Offset Shadow */}
                <div className="w-20 h-20 bg-white rounded-full border-2 border-[#111111] flex items-center justify-center mb-6 shadow-[4px_4px_0px_#111111] group-hover:scale-110 transition-transform">
                  <Icon className="w-10 h-10 text-[#E63946]" />
                </div>

                {/* Badge Tag */}
                <span className="text-[10px] font-black uppercase tracking-widest text-[#E63946] bg-[#E63946]/10 px-2.5 py-1 rounded-full mb-3 border border-[#E63946]/20">
                  {lang === 'en' ? item.badgeEn : item.badgeBn}
                </span>

                {/* Title */}
                <h3 className={`text-xl font-black text-[#111111] mb-3 ${headingFontClass}`}>
                  {t[item.titleKey]}
                </h3>

                {/* One-liner Description */}
                <p className={`text-sm text-[#6B7280] leading-relaxed max-w-xs ${bodyFontClass}`}>
                  {t[item.descKey]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
