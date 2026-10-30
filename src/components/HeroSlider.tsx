import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Gift, ArrowRight } from 'lucide-react';
import type { HeroSlideContent, BookingStripContent } from '../types/car';
import { DEFAULT_SITE_CONTENT } from '../data/carsData';

interface HeroSliderProps {
  onOpenLeadModal: (modelName?: string, needType?: string) => void;
  slides?: HeroSlideContent[];
  bookingStrip?: BookingStripContent;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ 
  onOpenLeadModal,
  slides = DEFAULT_SITE_CONTENT.heroSlides,
  bookingStrip = DEFAULT_SITE_CONTENT.bookingStrip
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-vw-dark">
      {/* Slides Container */}
      <div className="relative h-[480px] sm:h-[550px] lg:h-[620px] w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent lg:w-3/4" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl text-white space-y-4">
                
                {/* Badge */}
                {slide.badge && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vw-cyan/20 border border-vw-cyan/40 text-vw-cyan text-xs font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{slide.badge}</span>
                  </div>
                )}

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase drop-shadow-md">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Call to action buttons */}
                <div className="pt-2 flex flex-wrap gap-3 sm:gap-4">
                  <button
                    onClick={() => onOpenLeadModal(slide.model, 'Nhận báo giá')}
                    className="px-6 py-3.5 rounded-full bg-vw-cyan hover:bg-vw-cyan-hover text-vw-dark font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-2 group"
                  >
                    <span>{slide.ctaText || 'NHẬN BÁO GIÁ'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => onOpenLeadModal(slide.model, 'Đăng kí lái thử')}
                    className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-white/30 transition-all"
                  >
                    Đăng Ký Lái Thử
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls (Prev/Next) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors focus:outline-none"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors focus:outline-none"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-8 bg-vw-cyan' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Booking Strip Banner - Exact replica of volkswagengolden.vn strip */}
      <div className="bg-vw-blue border-t border-vw-blue-light/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3 text-center sm:text-left">
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-vw-cyan/20 items-center justify-center text-vw-cyan flex-shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {bookingStrip.title}
                </h2>
                <p className="text-xs text-slate-300">
                  {bookingStrip.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenLeadModal(undefined, 'Nhận báo giá')}
              className="px-6 py-2.5 rounded-full bg-vw-red hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest shadow-md hover:shadow-red-900/30 transition-all flex-shrink-0"
            >
              {bookingStrip.buttonText || 'NHẬN ƯU ĐÃI'}
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};
