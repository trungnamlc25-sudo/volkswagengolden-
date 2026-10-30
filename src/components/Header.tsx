import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Menu, X, ChevronRight, Clock } from 'lucide-react';
import { SHOWROOM_INFO } from '../data/carsData';
import type { ShowroomSettings } from '../types/car';

interface HeaderProps {
  onOpenLeadModal: (modelName?: string, needType?: string) => void;
  onOpenAdminViewer?: () => void;
  settings?: ShowroomSettings;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLeadModal, settings }) => {
  const info = settings || SHOWROOM_INFO;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-md py-1' : 'shadow-sm py-0'
      }`}>
        {/* Top bar - Hides on scroll on desktop for clean view */}
        <div className={`transition-all duration-300 border-b border-slate-100 ${
          isScrolled ? 'hidden lg:hidden' : 'block'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center justify-between gap-4">
              
              {/* Brand Logo & Name */}
              <div className="flex items-center space-x-3">
                <a href="#" className="flex items-center space-x-2.5 group">
                  <div className="w-11 h-11 rounded-full bg-vw-blue flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
                    {/* SVG VW Logo */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4.5" />
                      <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                      <path d="M 28,26 L 44,74 L 50,56 L 56,74 L 72,26 L 62,26 L 53,53 L 50,44 L 53,35 L 61,35 L 63,26 L 37,26 L 39,35 L 47,35 L 50,44 L 47,53 L 38,26 Z" />
                      <path d="M 50,58 L 46,70 L 54,70 Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-base font-extrabold text-vw-blue tracking-tight leading-none">
                      {info.name.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-semibold text-vw-cyan tracking-wider uppercase">
                      Đại Lý Chính Hãng
                    </span>
                  </div>
                </a>
              </div>

              {/* Showroom Address */}
              <div className="hidden lg:flex items-center text-xs text-slate-600 max-w-md">
                <MapPin className="w-4 h-4 text-vw-cyan mr-1.5 flex-shrink-0" />
                <span className="line-clamp-1">{info.address}</span>
              </div>

              {/* Working Hours & Hotline */}
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  <span>{info.openHours}</span>
                </div>

                <a 
                  href={`tel:${info.hotline}`}
                  className="flex items-center space-x-2 text-right group"
                  aria-label="Gọi ngay hotline"
                >
                  <div className="w-9 h-9 rounded-full bg-red-50 text-vw-red flex items-center justify-center group-hover:bg-vw-red group-hover:text-white transition-colors hotline-pulse">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                      HOTLINE 24/7
                    </span>
                    <span className="text-sm font-black text-vw-red group-hover:underline">
                      {info.hotlineFormatted}
                    </span>
                  </div>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Scrolled Logo (compact) */}
            <div className={`items-center space-x-2 ${isScrolled ? 'flex' : 'flex lg:hidden'}`}>
              <a href="#" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-vw-blue flex items-center justify-center p-1">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4.5" />
                    <path d="M 28,26 L 44,74 L 50,56 L 56,74 L 72,26 L 62,26 L 53,53 L 50,44 L 53,35 L 61,35 L 63,26 L 37,26 L 39,35 L 47,35 L 50,44 L 47,53 L 38,26 Z" />
                  </svg>
                </div>
                <span className="font-extrabold text-sm text-vw-blue tracking-tight">VW GOLDEN</span>
              </a>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 font-medium text-sm text-slate-700">
              <a
                href="#hero"
                onClick={(e) => scrollToSection(e, 'hero')}
                className="px-3 py-2 rounded-md hover:text-vw-blue hover:bg-slate-50 transition-colors font-bold text-vw-blue"
              >
                Trang chủ
              </a>
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, 'about')}
                className="px-3 py-2 rounded-md hover:text-vw-blue hover:bg-slate-50 transition-colors"
              >
                Giới thiệu
              </a>
              <a
                href="#cars"
                onClick={(e) => scrollToSection(e, 'cars')}
                className="px-3 py-2 rounded-md hover:text-vw-blue hover:bg-slate-50 transition-colors"
              >
                Bảng giá xe
              </a>
              <a
                href="#calculator"
                onClick={(e) => scrollToSection(e, 'calculator')}
                className="px-3 py-2 rounded-md hover:text-vw-blue hover:bg-slate-50 transition-colors"
              >
                Dự toán lăn bánh
              </a>
              <a
                href="#events"
                onClick={(e) => scrollToSection(e, 'events')}
                className="px-3 py-2 rounded-md hover:text-vw-blue hover:bg-slate-50 transition-colors"
              >
                Sự kiện & Bàn giao
              </a>
              <a
                href="#news"
                onClick={(e) => scrollToSection(e, 'news')}
                className="px-3 py-2 rounded-md hover:text-vw-blue hover:bg-slate-50 transition-colors"
              >
                Tin tức & Ưu đãi
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="px-3 py-2 rounded-md hover:text-vw-blue hover:bg-slate-50 transition-colors"
              >
                Liên hệ
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenLeadModal(undefined, 'Nhận báo giá')}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-vw-blue hover:bg-vw-blue-light rounded-full shadow-sm hover:shadow transition-all duration-200"
              >
                Đăng ký tư vấn
              </button>
              
              <button
                onClick={() => onOpenLeadModal(undefined, 'Đăng kí lái thử')}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-vw-blue border border-vw-blue hover:bg-vw-blue hover:text-white rounded-full transition-all duration-200"
              >
                Lái thử xe
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-slate-700 hover:text-vw-blue hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer panel */}
        <div className={`fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          <div>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-vw-blue flex items-center justify-center p-1 text-white">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4.5" />
                    <path d="M 28,26 L 44,74 L 50,56 L 56,74 L 72,26 L 62,26 L 53,53 L 50,44 L 53,35 L 61,35 L 63,26 L 37,26 L 39,35 L 47,35 L 50,44 L 47,53 L 38,26 Z" />
                  </svg>
                </div>
                <span className="font-extrabold text-sm text-vw-blue">VOLKSWAGEN GOLDEN</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-slate-500 hover:text-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              <a
                href="#hero"
                onClick={(e) => scrollToSection(e, 'hero')}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-slate-800 hover:bg-slate-50 font-medium"
              >
                <span>Trang chủ</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, 'about')}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-slate-800 hover:bg-slate-50 font-medium"
              >
                <span>Giới thiệu Showroom</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#cars"
                onClick={(e) => scrollToSection(e, 'cars')}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-slate-800 hover:bg-slate-50 font-medium"
              >
                <span>Bảng giá & Dòng xe</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#calculator"
                onClick={(e) => scrollToSection(e, 'calculator')}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-slate-800 hover:bg-slate-50 font-medium"
              >
                <span>Dự toán lăn bánh & Trả góp</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#events"
                onClick={(e) => scrollToSection(e, 'events')}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-slate-800 hover:bg-slate-50 font-medium"
              >
                <span>Sự kiện & Bàn giao xe</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#news"
                onClick={(e) => scrollToSection(e, 'news')}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-slate-800 hover:bg-slate-50 font-medium"
              >
                <span>Tin tức & Khuyến mãi</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-slate-800 hover:bg-slate-50 font-medium"
              >
                <span>Liên hệ & Bản đồ</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </nav>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLeadModal(undefined, 'Nhận báo giá');
              }}
              className="w-full py-3 bg-vw-blue text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow hover:bg-vw-blue-light transition-colors"
            >
              Đăng Ký Tư Vấn Ngay
            </button>

            <a
              href={`tel:${info.hotline}`}
              className="w-full py-2.5 flex items-center justify-center space-x-2 text-vw-red border border-red-200 bg-red-50 rounded-xl font-bold text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi Hotline: {info.hotlineFormatted}</span>
            </a>
          </div>

        </div>
      </div>
    </>
  );
};
