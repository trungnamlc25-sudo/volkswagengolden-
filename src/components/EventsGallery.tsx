import React, { useState } from 'react';
import { EVENTS_DATA } from '../data/eventsData';
import type { EventItem, GallerySectionContent } from '../types/car';
import { Camera, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface EventsGalleryProps {
  content?: GallerySectionContent;
}

export const EventsGallery: React.FC<EventsGalleryProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState<'showroom' | 'customer' | 'handover'>('showroom');
  const [lightboxImage, setLightboxImage] = useState<EventItem | null>(null);

  const allEvents = content?.items && content.items.length > 0 ? content.items : EVENTS_DATA;
  const filteredEvents = allEvents.filter((item) => item.category === activeTab);

  const openLightbox = (item: EventItem) => {
    setLightboxImage(item);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const nextLightbox = () => {
    if (!lightboxImage) return;
    const currentIndex = filteredEvents.findIndex((i) => i.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % filteredEvents.length;
    setLightboxImage(filteredEvents[nextIndex]);
  };

  const prevLightbox = () => {
    if (!lightboxImage) return;
    const currentIndex = filteredEvents.findIndex((i) => i.id === lightboxImage.id);
    const prevIndex = (currentIndex - 1 + filteredEvents.length) % filteredEvents.length;
    setLightboxImage(filteredEvents[prevIndex]);
  };

  return (
    <section id="events" className="py-16 lg:py-24 bg-vw-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-black tracking-widest text-vw-cyan uppercase">
            {content?.badge || 'HÌNH ẢNH THỰC TẾ'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-vw-blue tracking-tight">
            {content?.title || 'Sự Kiện & Hoạt Động Volkswagen'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {content?.subtitle || 'Ghi lại những khoảnh khắc đáng nhớ tại Showroom và lễ bàn giao xe tới tay Quý khách hàng.'}
          </p>
        </div>

        {/* 3 Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          <button
            onClick={() => setActiveTab('showroom')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'showroom'
                ? 'bg-vw-blue text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Giới thiệu Showroom
          </button>

          <button
            onClick={() => setActiveTab('customer')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'customer'
                ? 'bg-vw-blue text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Khách hàng tại Showroom
          </button>

          <button
            onClick={() => setActiveTab('handover')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'handover'
                ? 'bg-vw-blue text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Lễ Bàn Giao Xe Mới
          </button>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <p className="text-xs font-semibold leading-snug line-clamp-2">
                  {item.title}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] text-vw-cyan font-bold mt-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem ảnh phóng to</span>
                </span>
              </div>

              {/* Camera badge */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white/80 group-hover:bg-vw-cyan group-hover:text-vw-dark transition-colors">
                <Camera className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Ảnh kế tiếp"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={lightboxImage.image}
              alt={lightboxImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
            />
            <p className="text-white text-xs sm:text-sm font-medium text-center mt-3 max-w-xl">
              {lightboxImage.title}
            </p>
          </div>

        </div>
      )}

    </section>
  );
};
