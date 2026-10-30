import React from 'react';
import { Phone, Mail, MapPin, Clock, ChevronRight } from 'lucide-react';
import { CARS_DATA, SHOWROOM_INFO } from '../data/carsData';
import type { CarModel, ShowroomSettings } from '../types/car';

interface FooterProps {
  onSelectCarDetail: (car: CarModel) => void;
  onOpenLeadModal: (modelName?: string, needType?: string) => void;
  onOpenAdminViewer?: () => void;
  settings?: ShowroomSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCarDetail,
  onOpenLeadModal,
  settings
}) => {
  const info = settings || SHOWROOM_INFO;

  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Dealer Band CTA */}
      <div className="bg-vw-blue py-8 border-b border-vw-blue-light/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Đại lý {info.name}
            </h3>
            <p className="text-xs text-slate-200 mt-0.5">
              Đăng ký lái thử ngay hôm nay để nhận trọn bộ quà tặng đặc quyền và giá bán tốt nhất!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenLeadModal(undefined, 'Đăng kí lái thử')}
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-vw-blue font-extrabold text-xs uppercase tracking-wider shadow transition-colors"
            >
              Đăng Ký Lái Thử
            </button>
            <a
              href={`tel:${info.hotline}`}
              className="px-5 py-3 rounded-full bg-vw-red hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow transition-colors"
            >
              Hotline Tư Vấn
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Company Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-vw-blue flex items-center justify-center p-1 text-white border border-vw-blue-light">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4.5" />
                  <path d="M 28,26 L 44,74 L 50,56 L 56,74 L 72,26 L 62,26 L 53,53 L 50,44 L 53,35 L 61,35 L 63,26 L 37,26 L 39,35 L 47,35 L 50,44 L 47,53 L 38,26 Z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  {info.company}
                </h4>
                <span className="text-[11px] font-semibold text-vw-cyan uppercase">
                  {info.name}
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed">
              Đại lý ủy quyền chính hãng của Volkswagen. Phân phối các dòng xe SUV, MPV và Hatchback nhập khẩu nguyên chiếc với tiêu chuẩn dịch vụ bán hàng và hậu mãi 4S toàn cầu.
            </p>

            <div className="space-y-2 pt-2 text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-vw-cyan flex-shrink-0 mt-0.5" />
                <span>{info.address}</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-vw-red flex-shrink-0" />
                <span>Hotline kinh doanh & dịch vụ:{' '}
                  <a href={`tel:${info.hotline}`} className="text-white font-bold hover:underline">
                    {info.hotlineFormatted}
                  </a>
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-vw-cyan flex-shrink-0" />
                <span>Email:{' '}
                  <a href={`mailto:${info.email}`} className="text-white hover:underline">
                    {info.email}
                  </a>
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Giờ mở cửa: {info.openHours}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-3">
              <a
                href={info.facebook || SHOWROOM_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
              <a
                href={info.youtube || SHOWROOM_INFO.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55A3.016 3.016 0 0 0 .501 6.186C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.5 12 20.5 12 20.5s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href={info.tiktok || SHOWROOM_INFO.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs transition-colors"
                aria-label="TikTok"
              >
                TK
              </a>
            </div>

          </div>

          {/* Column 2: Car Lineup (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Dòng Xe Volkswagen
            </h4>
            <ul className="space-y-2">
              {CARS_DATA.map((car) => (
                <li key={car.id}>
                  <button
                    onClick={() => onSelectCarDetail(car)}
                    className="hover:text-vw-cyan flex items-center gap-1.5 transition-colors text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{car.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Interactive Map (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Vị Trí Showroom
            </h4>
            <div className="rounded-2xl overflow-hidden border border-slate-800 h-[210px] w-full shadow-inner bg-slate-900">
              <iframe
                title="Volkswagen Thế Kiệt Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.759815222098!2d106.65477020000002!3d10.7529853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ef47d74c789%3A0x2777b0640bc48279!2sGolden%20Plaza!5e0!3m2!1svi!2s!4v1785901257927!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Tầng trệt tòa nhà Golden Plaza, 922 Nguyễn Trãi, Phường Chợ Lớn, TP.HCM. Có bãi đậu xe ô tô rộng rãi và an toàn.
            </p>
          </div>

        </div>

        {/* Live Visitor Statistics - Exact replica of volkswagengolden.vn stats */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div>
              <span className="text-slate-300">Đang online: </span>
              <strong className="text-vw-cyan font-bold">12</strong>
            </div>
            <div>
              <span className="text-slate-300">Lượt truy cập hôm nay: </span>
              <strong className="text-slate-200 font-bold">148</strong>
            </div>
            <div>
              <span className="text-slate-300">30 ngày qua: </span>
              <strong className="text-slate-200 font-bold">24.190</strong>
            </div>
            <div>
              <span className="text-slate-300">Tổng lượt xem: </span>
              <strong className="text-slate-200 font-bold">385.420</strong>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-slate-900 text-center text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} Volkswagen Thế Kiệt. Tất cả các quyền được bảo lưu. Thiết kế và vận hành theo tiêu chuẩn Volkswagen Châu Âu.</p>
        </div>

      </div>

    </footer>
  );
};
