import React from 'react';
import { NEWS_DATA } from '../data/eventsData';
import { Clock, ArrowRight, BookOpen, Wrench } from 'lucide-react';
import type { NewsSectionContent } from '../types/car';

interface NewsSectionProps {
  onOpenLeadModal: (modelName?: string, needType?: string) => void;
  content?: NewsSectionContent;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onOpenLeadModal, content }) => {
  const newsList = content?.newsItems && content.newsItems.length > 0 ? content.newsItems : NEWS_DATA;
  const magCard = content?.magazineCard || {
    title: 'Tạp chí Volkswagen',
    description: 'Khám phá lịch sử thương hiệu, công nghệ động cơ TSI và phong cách sống thượng lưu cùng những chủ nhân xe Volkswagen.',
    buttonText: 'KHÁM PHÁ ẤN PHẨM',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/TAP-CHI-VOLKSWAGEN-1024x568.png'
  };

  const workCard = content?.workshopCard || {
    title: 'Đặt Hẹn Dịch Vụ & Bảo Dưỡng',
    description: 'Xưởng dịch vụ Volkswagen với trang thiết bị chẩn đoán ODIS tiêu chuẩn CHLB Đức và phụ tùng chính hãng 100%.',
    buttonText: 'ĐẶT LỊCH HẸN NGAY',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/DAT-LICH-HEN-1024x576.jpg'
  };

  return (
    <section id="news" className="py-16 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* News Grid Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black tracking-widest text-vw-cyan uppercase">
            {content?.badge || 'BẢN TIN VOLKSWAGEN'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-vw-blue tracking-tight">
            {content?.title || 'Tin Tức, Sự Kiện & Khuyến Mãi'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {content?.subtitle || 'Cập nhật các chương trình ưu đãi giá bán, sự kiện trải nghiệm lái thử và tin tức ô tô mới nhất.'}
          </p>
        </div>

        {/* 4 News Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsList.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-vw-cyan uppercase">{item.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.readTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-vw-blue group-hover:text-vw-cyan transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => onOpenLeadModal(undefined, `Tìm hiểu: ${item.title}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-vw-blue hover:text-vw-cyan transition-colors"
                >
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* 2 Featured Action Banners - Replica of volkswagengolden.vn story cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Card 1: Tạp chí Volkswagen */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 flex flex-col justify-between min-h-[260px] group shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700" 
              style={{ backgroundImage: `url('${magCard.image}')` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />

            <div className="relative z-10 space-y-2">
              <div className="w-10 h-10 rounded-full bg-vw-cyan/20 flex items-center justify-center text-vw-cyan mb-2">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white">{magCard.title}</h3>
              <p className="text-xs text-slate-300 max-w-sm">
                {magCard.description}
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <button
                onClick={() => onOpenLeadModal(undefined, 'Nhận ấn phẩm tạp chí Volkswagen')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-vw-cyan hover:bg-vw-cyan-hover text-vw-dark text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>{magCard.buttonText || 'KHÁM PHÁ ẤN PHẨM'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Đặt hẹn dịch vụ */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 flex flex-col justify-between min-h-[260px] group shadow-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700" 
              style={{ backgroundImage: `url('${workCard.image}')` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />

            <div className="relative z-10 space-y-2">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-vw-red mb-2">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white">{workCard.title}</h3>
              <p className="text-xs text-slate-300 max-w-sm">
                {workCard.description}
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <button
                onClick={() => onOpenLeadModal(undefined, 'Đặt hẹn dịch vụ & bảo dưỡng xe')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-vw-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>{workCard.buttonText || 'ĐẶT LỊCH HẸN NGAY'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
