import React, { useState } from 'react';
import type { CarModel, ShowroomSettings } from '../types/car';
import { X, Check, Shield, Award, Zap, FileText } from 'lucide-react';
import { SHOWROOM_INFO } from '../data/carsData';

interface CarDetailModalProps {
  car: CarModel | null;
  onClose: () => void;
  onOpenLeadModal: (modelName?: string, needType?: string) => void;
  onSelectCarForCalc: (car: CarModel) => void;
  settings?: ShowroomSettings;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  onOpenLeadModal,
  onSelectCarForCalc,
  settings
}) => {
  const info = settings || SHOWROOM_INFO;
  if (!car) return null;

  const [activeImage, setActiveImage] = useState(car.image);
  const [selectedColor, setSelectedColor] = useState(car.colors[0]?.name || '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div>
            <span className="text-[11px] font-bold text-vw-cyan tracking-widest uppercase">
              {car.categoryLabel}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-vw-blue">
              {car.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Đóng modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-grow">
          
          {/* Top Gallery & Color Picker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Main Visual */}
            <div className="lg:col-span-8 space-y-3">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img
                  src={activeImage}
                  alt={car.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {car.gallery && car.gallery.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {car.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImage === img ? 'border-vw-cyan scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Price & Color Selection */}
            <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-5">
              <div>
                <span className="text-xs text-slate-500 font-medium">Giá bán niêm yết:</span>
                <div className="text-2xl font-black text-vw-red mt-0.5">
                  {car.priceText}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Ưu đãi lệ phí trước bạ & bảo dưỡng</span>
                </p>
              </div>

              {/* Colors */}
              {car.colors && car.colors.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Màu sắc ngoại thất: <span className="text-vw-blue font-semibold">{selectedColor}</span>
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {car.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          selectedColor === c.name ? 'border-vw-cyan scale-110 shadow' : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenLeadModal(car.name, 'Nhận báo giá');
                  }}
                  className="w-full py-3 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Yêu Cầu Báo Giá Lăn Bánh</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenLeadModal(car.name, 'Đăng kí lái thử');
                  }}
                  className="w-full py-2.5 bg-white border border-vw-blue text-vw-blue hover:bg-slate-100 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Đặt Lịch Lái Thử Dòng Xe Này
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onSelectCarForCalc(car);
                  }}
                  className="w-full py-2 text-xs font-bold text-vw-cyan hover:underline text-center block"
                >
                  Tính Bảng Trả Góp Ngân Hàng & Lăn Bánh &rarr;
                </button>
              </div>

            </div>

          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-vw-blue flex items-center gap-2">
              <Award className="w-5 h-5 text-vw-cyan" />
              <span>Đặc Điểm Nổi Bật</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {car.highlights.map((h, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Check className="w-4 h-4 text-vw-cyan flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-vw-blue flex items-center gap-2">
              <Zap className="w-5 h-5 text-vw-cyan" />
              <span>Thông Số Kỹ Thuật Chi Tiết</span>
            </h3>
            
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                
                {/* Column 1 */}
                <div className="divide-y divide-slate-100">
                  <div className="flex justify-between p-3 bg-white">
                    <span className="text-slate-500 font-medium">Động cơ:</span>
                    <span className="font-bold text-slate-800 text-right">{car.specs.engine}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50/50">
                    <span className="text-slate-500 font-medium">Công suất cực đại:</span>
                    <span className="font-bold text-slate-800 text-right">{car.specs.maxPower}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white">
                    <span className="text-slate-500 font-medium">Mô-men xoắn cực đại:</span>
                    <span className="font-bold text-slate-800 text-right">{car.specs.torque}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50/50">
                    <span className="text-slate-500 font-medium">Hộp số:</span>
                    <span className="font-bold text-slate-800 text-right">{car.specs.transmission}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white">
                    <span className="text-slate-500 font-medium">Hệ dẫn động:</span>
                    <span className="font-bold text-slate-800 text-right">{car.specs.drivetrain}</span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="divide-y divide-slate-100">
                  <div className="flex justify-between p-3 bg-white">
                    <span className="text-slate-500 font-medium">Số chỗ ngồi:</span>
                    <span className="font-bold text-slate-800 text-right">{car.specs.seats} chỗ</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50/50">
                    <span className="text-slate-500 font-medium">Kích thước (DxRxC):</span>
                    <span className="font-bold text-slate-800 text-right">{car.specs.dimensions}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white">
                    <span className="text-slate-500 font-medium">Chiều dài cơ sở:</span>
                    <span className="font-bold text-slate-800 text-right">{car.specs.wheelbase}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50/50">
                    <span className="text-slate-500 font-medium">Mức tiêu thụ nhiên liệu:</span>
                    <span className="font-bold text-slate-800 text-right">{car.specs.fuelConsumption || 'Đang cập nhật'}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white">
                    <span className="text-slate-500 font-medium">Tăng tốc 0-100 km/h:</span>
                    <span className="font-bold text-slate-800 text-right">{car.specs.acceleration || 'Đang cập nhật'}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Safety & Technology Features */}
          {car.features && car.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-vw-blue flex items-center gap-2">
                <Shield className="w-5 h-5 text-vw-cyan" />
                <span>Trang Bị An Toàn & Tiện Nghi</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {car.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-vw-cyan flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Callout */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            Cần tư vấn ngay? Gọi Hotline trực tiếp:{' '}
            <a href={`tel:${info.hotline}`} className="font-black text-vw-red hover:underline">
              {info.hotlineFormatted}
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 font-semibold text-xs"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenLeadModal(car.name, 'Nhận báo giá');
              }}
              className="px-6 py-2 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Liên Hệ Ngay
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
