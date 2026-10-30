import React, { useState } from 'react';
import { CARS_DATA } from '../data/carsData';
import type { CarModel, CarSectionContent } from '../types/car';
import { Users, Gauge, Cog, Compass, Eye, FileText, Calculator } from 'lucide-react';

interface CarGridProps {
  onSelectCarDetail: (car: CarModel) => void;
  onOpenLeadModal: (modelName?: string, needType?: string) => void;
  onSelectCarForCalc: (car: CarModel) => void;
  cars?: CarModel[];
  sectionContent?: CarSectionContent;
}

export const CarGrid: React.FC<CarGridProps> = ({
  onSelectCarDetail,
  onOpenLeadModal,
  onSelectCarForCalc,
  cars = CARS_DATA,
  sectionContent
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'suv' | 'mpv' | 'hatchback'>('all');

  const carsList = cars && cars.length > 0 ? cars : CARS_DATA;

  const filteredCars = activeTab === 'all' 
    ? carsList 
    : carsList.filter(car => car.category === activeTab);

  const suvCount = carsList.filter(c => c.category === 'suv').length;
  const mpvCount = carsList.filter(c => c.category === 'mpv').length;
  const hatchbackCount = carsList.filter(c => c.category === 'hatchback').length;

  return (
    <section id="cars" className="py-16 lg:py-24 bg-vw-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-black tracking-widest text-vw-cyan uppercase">
            {sectionContent?.badge || 'BẢNG GIÁ & DÒNG XE'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-vw-blue tracking-tight">
            {sectionContent?.title || 'Dòng Xe Volkswagen Nổi Bật'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {sectionContent?.subtitle || 'Khám phá những kiệt tác cơ khí đỉnh cao từ Đức. Đầy đủ các phân khúc từ SUV gia đình, MPV thương gia đến Hatchback thể thao.'}
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-vw-blue text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Tất cả dòng xe ({carsList.length})
          </button>

          <button
            onClick={() => setActiveTab('suv')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'suv'
                ? 'bg-vw-blue text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            SUV / Crossover ({suvCount})
          </button>

          <button
            onClick={() => setActiveTab('mpv')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'mpv'
                ? 'bg-vw-blue text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            MPV Thương Gia ({mpvCount})
          </button>

          <button
            onClick={() => setActiveTab('hatchback')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'hatchback'
                ? 'bg-vw-blue text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Hatchback Thể Thao ({hatchbackCount})
          </button>
        </div>

        {/* Car Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredCars.map((car) => (
            <article
              key={car.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Badge */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectCarDetail(car)}>
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {car.badge && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-vw-blue/90 text-white text-[10px] font-black uppercase tracking-wider shadow backdrop-blur-xs">
                      {car.badge}
                    </div>
                  )}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                    {car.categoryLabel}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div>
                    <h3 
                      onClick={() => onSelectCarDetail(car)}
                      className="text-base font-extrabold text-vw-blue group-hover:text-vw-cyan transition-colors cursor-pointer line-clamp-1"
                    >
                      {car.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {car.tagline}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="pt-1 flex items-baseline justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Giá niêm yết:</span>
                    <span className="text-sm sm:text-base font-black text-vw-red tracking-tight">
                      {car.priceText}
                    </span>
                  </div>

                  {/* Quick Specs Icons */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-vw-cyan flex-shrink-0" />
                      <span>{car.specs.seats} chỗ</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Gauge className="w-3.5 h-3.5 text-vw-cyan flex-shrink-0" />
                      <span className="truncate">{car.specs.engine.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Cog className="w-3.5 h-3.5 text-vw-cyan flex-shrink-0" />
                      <span className="truncate">{car.specs.transmission.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Compass className="w-3.5 h-3.5 text-vw-cyan flex-shrink-0" />
                      <span className="truncate">{car.specs.drivetrain}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectCarDetail(car)}
                    className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-vw-blue text-slate-700 hover:text-vw-blue font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Chi Tiết</span>
                  </button>

                  <button
                    onClick={() => onOpenLeadModal(car.name, 'Nhận báo giá')}
                    className="py-2.5 px-3 rounded-xl bg-vw-blue hover:bg-vw-blue-light text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Báo Giá</span>
                  </button>
                </div>

                <button
                  onClick={() => onSelectCarForCalc(car)}
                  className="w-full py-2 text-slate-500 hover:text-vw-blue text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 hover:bg-slate-50 rounded-lg"
                >
                  <Calculator className="w-3 h-3 text-slate-400" />
                  <span>Dự toán lăn bánh & Trả góp</span>
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
