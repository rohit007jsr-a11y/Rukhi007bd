import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Code, 
  Smartphone, 
  Monitor, 
  ExternalLink, 
  Mail, 
  Sparkles,
  KeyRound,
  UserPlus,
  ShieldAlert
} from 'lucide-react';
import { 
  SUPABASE_EMAIL_TEMPLATES, 
  SupabaseEmailTemplate, 
  renderTemplatePreview 
} from '../data/supabaseEmailTemplates';

interface SupabaseEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplateId?: 'confirm-signup' | 'invite-user' | 'reset-password';
}

export const SupabaseEmailModal: React.FC<SupabaseEmailModalProps> = ({
  isOpen,
  onClose,
  initialTemplateId = 'confirm-signup'
}) => {
  if (!isOpen) return null;

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTemplateId);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);

  const activeTemplate: SupabaseEmailTemplate = 
    SUPABASE_EMAIL_TEMPLATES.find(t => t.id === selectedTemplateId) || SUPABASE_EMAIL_TEMPLATES[0];

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(activeTemplate.html);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    } catch (err) {
      console.error('Failed to copy html', err);
    }
  };

  const handleCopySubject = async () => {
    try {
      await navigator.clipboard.writeText(activeTemplate.defaultSubject);
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2500);
    } catch (err) {
      console.error('Failed to copy subject', err);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([activeTemplate.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTemplate.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl border-2 border-[#111111] max-w-5xl w-full shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 bg-[#111111] text-white flex items-center justify-between border-b-2 border-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E63946] border border-white flex items-center justify-center font-black text-xs text-white">
              RK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black uppercase tracking-wider font-heading-en text-white">
                  Native Supabase Auth Email Templates
                </h2>
                <span className="bg-[#E63946] text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                  RUKHI BRANDED
                </span>
              </div>
              <p className="text-xs text-gray-300">
                100% compatible with Supabase Auth Email Templates (<code className="text-[#E63946] font-mono">&#123;&#123; .ConfirmationURL &#125;&#125;</code> &amp; <code className="text-[#E63946] font-mono">&#123;&#123; .Token &#125;&#125;</code>)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Template Selector Tabs */}
        <div className="bg-[#F7F7F5] border-b-2 border-[#111111] p-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {SUPABASE_EMAIL_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplateId;
              const Icon = 
                tmpl.id === 'confirm-signup' ? UserPlus :
                tmpl.id === 'invite-user' ? Mail : KeyRound;

              return (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplateId(tmpl.id);
                    setCopiedHtml(false);
                    setCopiedSubject(false);
                  }}
                  className={`px-3 py-2 text-xs font-bold uppercase transition-all flex items-center gap-2 border-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-white border-[#111111] shadow-[3px_3px_0px_#E63946]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#111111]'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-[#E63946]' : 'text-gray-500'} />
                  <span>{tmpl.title}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyHtml}
              className="px-3.5 py-1.5 bg-[#E63946] hover:bg-[#d02f3c] text-white text-xs font-black uppercase tracking-wider border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              {copiedHtml ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedHtml ? 'Copied HTML!' : 'Copy HTML For Supabase'}</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              className="p-1.5 border-2 border-[#111111] bg-white hover:bg-gray-100 text-[#111111] transition-colors cursor-pointer"
              title="Download HTML file"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Supabase Dashboard Step Guide Bar */}
        <div className="p-3 bg-amber-50 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2 text-amber-950 font-medium">
            <Sparkles size={16} className="text-[#E63946] shrink-0" />
            <span>
              <strong>Where to paste:</strong> Supabase Dashboard &rarr; <strong>Authentication</strong> &rarr; <strong>Email Templates</strong> &rarr; tab <strong className="text-black bg-amber-200 px-1.5 py-0.5 rounded font-mono">"{activeTemplate.supabaseTabName}"</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-gray-500 text-[11px] font-bold">Subject:</span>
            <span className="bg-white border border-amber-300 px-2 py-0.5 font-bold text-gray-800 text-[11px] truncate max-w-xs">
              {activeTemplate.defaultSubject}
            </span>
            <button
              onClick={handleCopySubject}
              className="text-[10px] font-black uppercase text-[#E63946] hover:underline cursor-pointer flex items-center gap-1"
            >
              {copiedSubject ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedSubject ? 'Copied' : 'Copy Subject'}</span>
            </button>
          </div>
        </div>

        {/* Controls Toolbar: Mode switcher */}
        <div className="px-4 py-2 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                viewMode === 'preview' ? 'bg-white text-black shadow-sm border border-gray-300' : 'text-gray-500 hover:text-black'
              }`}
            >
              <Eye size={13} />
              <span>Live Visual Preview</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                viewMode === 'code' ? 'bg-white text-black shadow-sm border border-gray-300' : 'text-gray-500 hover:text-black'
              }`}
            >
              <Code size={13} />
              <span>Raw HTML &amp; Tags</span>
            </button>
          </div>

          {viewMode === 'preview' && (
            <div className="flex items-center gap-1 border border-gray-300 bg-white p-0.5 rounded">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1 rounded text-xs font-bold flex items-center gap-1 ${
                  deviceMode === 'desktop' ? 'bg-[#111111] text-white' : 'text-gray-500 hover:text-black'
                }`}
                title="Desktop view"
              >
                <Monitor size={14} />
                <span className="hidden sm:inline text-[11px] px-1">Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1 rounded text-xs font-bold flex items-center gap-1 ${
                  deviceMode === 'mobile' ? 'bg-[#111111] text-white' : 'text-gray-500 hover:text-black'
                }`}
                title="Mobile view (375px)"
              >
                <Smartphone size={14} />
                <span className="hidden sm:inline text-[11px] px-1">Mobile</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-200/80 p-4 min-h-[420px] flex justify-center items-start">
          {viewMode === 'preview' ? (
            <div 
              className={`bg-white border-2 border-gray-400 shadow-md transition-all mx-auto overflow-hidden ${
                deviceMode === 'mobile' ? 'w-[375px] max-w-full rounded-2xl border-4 border-gray-800 my-2' : 'w-full max-w-[620px]'
              }`}
            >
              <iframe
                title="Email Preview"
                srcDoc={renderTemplatePreview(activeTemplate.html)}
                className="w-full h-[580px] border-0"
                sandbox="allow-same-origin"
              />
            </div>
          ) : (
            <div className="w-full max-w-4xl bg-[#111111] text-gray-200 p-4 font-mono text-xs overflow-x-auto border-2 border-black rounded shadow">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
                <span className="text-[#E63946] font-bold">{activeTemplate.id}.html ({activeTemplate.html.length} characters)</span>
                <button
                  onClick={handleCopyHtml}
                  className="px-3 py-1 bg-white text-black hover:bg-[#E63946] hover:text-white font-bold text-xs uppercase transition-colors flex items-center gap-1.5"
                >
                  {copiedHtml ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedHtml ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="whitespace-pre-wrap break-all text-emerald-400 text-[11px] leading-relaxed max-h-[500px] overflow-y-auto">
                {activeTemplate.html}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Info & Instructions */}
        <div className="p-3 bg-white border-t-2 border-[#111111] flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-4 text-gray-600">
            <span><strong>Accepted tags:</strong></span>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              <span className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-gray-800">&#123;&#123; .ConfirmationURL &#125;&#125;</span>
              <span className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-gray-800">&#123;&#123; .Token &#125;&#125;</span>
              <span className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-gray-800">&#123;&#123; .Email &#125;&#125;</span>
              <span className="bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded text-gray-800">&#123;&#123; .SiteURL &#125;&#125;</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyHtml}
              className="px-4 py-2 bg-[#111111] hover:bg-[#E63946] text-white text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#E63946]"
            >
              {copiedHtml ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedHtml ? 'Copied Ready to Paste!' : 'Copy HTML For Supabase'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
