import React from 'react';
import { ArrowRight, Award, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import type { ShowroomIntroContent } from '../types/car';
import { DEFAULT_SITE_CONTENT } from '../data/carsData';

interface ShowroomIntroProps {
  onOpenLeadModal: (modelName?: string, needType?: string) => void;
  content?: ShowroomIntroContent;
}

export const ShowroomIntro: React.FC<ShowroomIntroProps> = ({ 
  onOpenLeadModal,
  content = DEFAULT_SITE_CONTENT.showroomIntro
}) => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Story & Highlights */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-vw-blue text-xs font-bold tracking-wider uppercase">
              <Building className="w-3.5 h-3.5 text-vw-cyan" />
              <span>{content.badge || 'URBAN STORE TIÊU CHUẨN ĐỨC'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-vw-blue tracking-tight leading-tight">
              {content.title}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {content.description}
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {content.features && content.features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  {idx === 0 && <CheckCircle2 className="w-5 h-5 text-vw-cyan flex-shrink-0 mt-0.5" />}
                  {idx === 1 && <ShieldCheck className="w-5 h-5 text-vw-cyan flex-shrink-0 mt-0.5" />}
                  {idx === 2 && <Award className="w-5 h-5 text-vw-cyan flex-shrink-0 mt-0.5" />}
                  {idx >= 3 && <CheckCircle2 className="w-5 h-5 text-vw-cyan flex-shrink-0 mt-0.5" />}
                  <div>
                    <h4 className="text-sm font-bold text-vw-blue">{feat.title}</h4>
                    <p className="text-xs text-slate-500">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenLeadModal(undefined, 'Đăng kí lái thử')}
                className="px-6 py-3 rounded-full bg-vw-blue hover:bg-vw-blue-light text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                <span>Đặt Lịch Tham Quan & Lái Thử</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#cars"
                className="px-5 py-3 rounded-full text-vw-blue hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Khám Phá Các Dòng Xe
              </a>
            </div>

          </div>

          {/* Right Column: Showroom Visual */}
          <div className="lg:col-span-6">
            <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-slate-200">
              <img
                src={content.image}
                alt="Volkswagen Golden Urban Store"
                className="w-full h-[380px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-vw-cyan uppercase tracking-widest">
                  Golden Plaza • 922 Nguyễn Trãi
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-1">
                  Không gian sang trọng chuẩn Châu Âu
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md">
                  Mời Quý khách hàng đến trải nghiệm dịch vụ tiếp đón đẳng cấp và trực tiếp cầm lái các siêu phẩm xe Đức.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
