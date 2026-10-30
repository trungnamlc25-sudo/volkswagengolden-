import React, { useState, useEffect } from 'react';
import { Phone, FileText, ArrowUp } from 'lucide-react';
import { SHOWROOM_INFO } from '../data/carsData';
import type { ShowroomSettings } from '../types/car';

interface FloatingToolbarProps {
  onOpenLeadModal: () => void;
  settings?: ShowroomSettings;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ onOpenLeadModal, settings }) => {
  const info = settings || SHOWROOM_INFO;
  const zaloUrl = info.zalo || `https://zalo.me/${info.zaloPhone ? info.zaloPhone.replace(/\s+/g, '') : '0789475066'}`;
  const messengerUrl = info.messenger || 'http://m.me/649644434900717';

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Floating Right Stack */}
      <div className="hidden lg:flex fixed right-4 bottom-8 z-40 flex-col items-end space-y-3">
        
        {/* Back to Top */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-11 h-11 rounded-full bg-white text-vw-blue shadow-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-all hover:-translate-y-1"
            title="Lên đầu trang"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Quick Quote Button */}
        <button
          onClick={onOpenLeadModal}
          className="group flex items-center bg-vw-blue text-white pl-4 pr-3 py-2.5 rounded-full shadow-xl hover:bg-vw-blue-light transition-all hover:scale-105"
          title="Nhận báo giá xe"
        >
          <span className="text-xs font-bold uppercase tracking-wider mr-2 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
            Báo Giá Ưu Đãi
          </span>
          <div className="w-8 h-8 rounded-full bg-vw-cyan text-vw-dark flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </button>

        {/* Messenger */}
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center bg-sky-600 text-white pl-4 pr-3 py-2.5 rounded-full shadow-xl hover:bg-sky-700 transition-all hover:scale-105"
          title="Chat Messenger"
        >
          <span className="text-xs font-bold uppercase tracking-wider mr-2 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
            Messenger
          </span>
          <div className="w-8 h-8 rounded-full bg-white text-sky-600 flex items-center justify-center font-black text-xs">
            💬
          </div>
        </a>

        {/* Zalo Chat */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center bg-blue-600 text-white pl-4 pr-3 py-2.5 rounded-full shadow-xl hover:bg-blue-700 transition-all hover:scale-105"
          title="Chat qua Zalo"
        >
          <span className="text-xs font-bold uppercase tracking-wider mr-2 max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
            Zalo: {info.zaloPhone}
          </span>
          <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-black text-xs">
            Zalo
          </div>
        </a>

        {/* Direct Phone Call */}
        <a
          href={`tel:${info.hotline}`}
          className="group flex items-center bg-vw-red text-white pl-4 pr-3 py-2.5 rounded-full shadow-xl hover:bg-red-700 transition-all hover:scale-105 hotline-pulse"
          title="Gọi Hotline"
        >
          <span className="text-xs font-extrabold uppercase tracking-wider mr-2">
            Hotline: {info.hotlineFormatted}
          </span>
          <div className="w-8 h-8 rounded-full bg-white text-vw-red flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
        </a>

      </div>

      {/* Mobile Sticky Bottom Toolbar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-2 px-3">
        <div className="grid grid-cols-4 gap-2 text-center">
          
          {/* Hotline */}
          <a
            href={`tel:${info.hotline}`}
            className="flex flex-col items-center justify-center p-1 text-vw-red"
          >
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-0.5">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight">Gọi Điện</span>
          </a>

          {/* Zalo */}
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-1 text-blue-600"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-0.5 font-bold text-[10px]">
              Zalo
            </div>
            <span className="text-[10px] font-bold tracking-tight">Zalo Chat</span>
          </a>

          {/* Messenger */}
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-1 text-sky-600"
          >
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mb-0.5 text-xs">
              💬
            </div>
            <span className="text-[10px] font-bold tracking-tight">Messenger</span>
          </a>

          {/* Quick Quote */}
          <button
            onClick={onOpenLeadModal}
            className="flex flex-col items-center justify-center p-1 text-vw-blue"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold tracking-tight">Báo Giá</span>
          </button>

        </div>
      </div>
    </>
  );
};
