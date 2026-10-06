import React from 'react';
import { X, ShieldCheck, FileText, HelpCircle, Truck } from 'lucide-react';
import { Language } from '../types';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'cod' | 'return' | 'size' | 'track' | 'story' | null;
  content: string;
  lang: Language;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
  content,
  lang,
}) => {
  if (!isOpen || !type) return null;

  const headingFontClass = lang === 'en' ? 'font-heading-en' : 'font-heading-bn';
  const bodyFontClass = lang === 'en' ? 'font-body-en' : 'font-body-bn';

  const getIcon = () => {
    switch (type) {
      case 'cod':
        return <ShieldCheck className="w-6 h-6 text-[#E63946]" />;
      case 'return':
        return <FileText className="w-6 h-6 text-[#E63946]" />;
      case 'size':
        return <HelpCircle className="w-6 h-6 text-[#E63946]" />;
      case 'track':
        return <Truck className="w-6 h-6 text-[#E63946]" />;
      default:
        return <FileText className="w-6 h-6 text-[#E63946]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border-4 border-[#111111] rounded-2xl shadow-[10px_10px_0px_#111111] overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-[#111111] text-white border-b-4 border-[#E63946] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-[#111111]">
              {getIcon()}
            </div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-tight text-white ${headingFontClass}`}>
                {title}
              </h2>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                Rukhi Official Policy Document
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white bg-gray-900 hover:bg-[#E63946] rounded-xl border border-gray-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto bg-[#F7F7F5]">
          <div className="p-4 bg-white rounded-xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111]">
            <p className={`whitespace-pre-line text-sm sm:text-base text-[#111111] leading-relaxed font-medium ${bodyFontClass}`}>
              {content || (lang === 'en' ? 'No policy document details available yet. Please check back soon.' : 'এখনো কোনো তথ্য যোগ করা হয়নি।')}
            </p>
          </div>

          <div className="p-4 bg-[#F0EDEA] rounded-xl border border-[#111111] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Verified Cash-on-Delivery Policy</span>
            <span className="font-bold text-[#111111]">Rukhi Bangladesh</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t-2 border-[#111111] flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 bg-[#111111] text-white font-extrabold text-xs uppercase rounded-lg border border-[#111111] shadow-[4px_4px_0px_#E63946] hover:bg-[#E63946] hover:shadow-[2px_2px_0px_#111111] transition-all cursor-pointer ${bodyFontClass}`}
          >
            {lang === 'en' ? 'Close Document' : 'বন্ধ করুন'}
          </button>
        </div>

      </div>
    </div>
  );
};
