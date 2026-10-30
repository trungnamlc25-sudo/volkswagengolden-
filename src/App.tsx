import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { ShowroomIntro } from './components/ShowroomIntro';
import { CarGrid } from './components/CarGrid';
import { PriceCalculator } from './components/PriceCalculator';
import { EventsGallery } from './components/EventsGallery';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';
import { CarDetailModal } from './components/CarDetailModal';
import { LeadModal } from './components/LeadModal';
import { AdminLeadViewer } from './components/AdminLeadViewer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { FloatingToolbar } from './components/FloatingToolbar';
import type { CarModel, ShowroomSettings, SiteContent } from './types/car';
import { CARS_DATA, SHOWROOM_INFO, DEFAULT_SITE_CONTENT } from './data/carsData';
import { 
  fetchSiteContent, 
  fetchCars, 
  fetchShowroomSettings, 
  saveNewLead,
  saveSiteContentToDb,
  saveCarsToDb,
  saveShowroomSettingsToDb 
} from './services/dataService';

export function App() {
  // Current Route: 'showroom' | 'admin'
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });

  // Authentication state for /admin (persisted in sessionStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('vw_admin_auth') === 'true';
  });

  // Dynamic Site Content (Hero slides, booking strip, showroom intro, car section, news, gallery)
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem('vw_golden_site_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_CONTENT,
          ...parsed,
          carSection: parsed.carSection || DEFAULT_SITE_CONTENT.carSection,
          newsSection: parsed.newsSection || DEFAULT_SITE_CONTENT.newsSection,
          gallerySection: parsed.gallerySection || DEFAULT_SITE_CONTENT.gallerySection
        };
      }
      return DEFAULT_SITE_CONTENT;
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  });

  // Dynamic Cars data (persisted in localStorage)
  const [cars, setCars] = useState<CarModel[]>(() => {
    try {
      const saved = localStorage.getItem('vw_golden_cars_custom');
      return saved ? JSON.parse(saved) : CARS_DATA;
    } catch {
      return CARS_DATA;
    }
  });

  // Dynamic Showroom Settings (persisted in localStorage)
  const [showroomSettings, setShowroomSettings] = useState<ShowroomSettings>(() => {
    try {
      const saved = localStorage.getItem('vw_golden_showroom_settings');
      return saved ? JSON.parse(saved) : SHOWROOM_INFO;
    } catch {
      return SHOWROOM_INFO;
    }
  });

  // Fetch latest data from Cloud Database (Supabase) if configured
  useEffect(() => {
    fetchSiteContent().then(content => setSiteContent(content));
    fetchCars().then(carList => setCars(carList));
    fetchShowroomSettings().then(st => setShowroomSettings(st));
  }, []);

  // Lead Quote Modal State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModel, setLeadModel] = useState<string | undefined>(undefined);
  const [leadNeed, setLeadNeed] = useState<string | undefined>(undefined);
  const [leadNote, setLeadNote] = useState<string | undefined>(undefined);

  // Car Detail Modal State
  const [selectedCarDetail, setSelectedCarDetail] = useState<CarModel | null>(null);

  // Car for Calculator State
  const [carForCalc, setCarForCalc] = useState<CarModel | null>(null);

  // Admin Quick Leads Viewer Modal State
  const [isAdminViewerOpen, setIsAdminViewerOpen] = useState(false);

  // Listen to browser URL changes (popstate & hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin';
      setIsAdminRoute(isAdmin);
      setIsAuthenticated(sessionStorage.getItem('vw_admin_auth') === 'true');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Auto-open quote popup after 4 seconds on showroom view only
  useEffect(() => {
    if (!isAdminRoute) {
      const hasSeenPopup = sessionStorage.getItem('vw_quote_popup_seen');
      if (!hasSeenPopup) {
        const timer = setTimeout(() => {
          setIsLeadModalOpen(true);
          setLeadNeed('Nhận báo giá');
          sessionStorage.setItem('vw_quote_popup_seen', 'true');
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAdminRoute]);

  const handleOpenLeadModal = (modelName?: string, needType?: string, noteInfo?: string) => {
    setLeadModel(modelName);
    setLeadNeed(needType || 'Nhận báo giá');
    setLeadNote(noteInfo);
    setIsLeadModalOpen(true);
  };

  const handleSelectCarForCalc = (car: CarModel) => {
    setCarForCalc(car);
    const element = document.getElementById('calculator');
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navigateToShowroom = () => {
    window.history.pushState(null, '', '/');
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vw_admin_auth');
    sessionStorage.removeItem('vw_admin_user');
    setIsAuthenticated(false);
    navigateToShowroom();
  };

  const handleUpdateCars = (updatedCars: CarModel[]) => {
    setCars(updatedCars);
    saveCarsToDb(updatedCars);
  };

  const handleUpdateSettings = (newSettings: ShowroomSettings) => {
    setShowroomSettings(newSettings);
    saveShowroomSettingsToDb(newSettings);
  };

  const handleUpdateSiteContent = (newContent: SiteContent) => {
    setSiteContent(newContent);
    saveSiteContentToDb(newContent);
  };

  // ----------------------------------------------------
  // ROUTE: /admin (Protected Area)
  // ----------------------------------------------------
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAuthenticated(true)}
          onBackToHome={navigateToShowroom}
        />
      );
    }

    return (
      <AdminDashboard
        onBackToShowroom={navigateToShowroom}
        onLogout={handleLogout}
        cars={cars}
        onUpdateCars={handleUpdateCars}
        settings={showroomSettings}
        onUpdateSettings={handleUpdateSettings}
        siteContent={siteContent}
        onUpdateSiteContent={handleUpdateSiteContent}
      />
    );
  }

  // ----------------------------------------------------
  // ROUTE: / (Public Showroom Website)
  // Completely clean, no public admin buttons or banners
  // ----------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-vw-bg text-vw-ink antialiased">
      
      {/* 1. Header */}
      <Header
        settings={showroomSettings}
        onOpenLeadModal={handleOpenLeadModal}
        onOpenAdminViewer={() => setIsAdminViewerOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {/* 2. Hero Banner Slider (Dynamic from Admin CMS) */}
        <HeroSlider 
          onOpenLeadModal={handleOpenLeadModal} 
          slides={siteContent.heroSlides}
          bookingStrip={siteContent.bookingStrip}
        />

        {/* 3. Showroom Urban Store Intro (Dynamic from Admin CMS) */}
        <ShowroomIntro 
          onOpenLeadModal={handleOpenLeadModal} 
          content={siteContent.showroomIntro}
        />

        {/* 4. Car Grid & Prices (Dynamic from Admin Pricing & CMS) */}
        <CarGrid
          cars={cars}
          sectionContent={siteContent.carSection}
          onSelectCarDetail={(car) => setSelectedCarDetail(car)}
          onOpenLeadModal={handleOpenLeadModal}
          onSelectCarForCalc={handleSelectCarForCalc}
        />

        {/* 5. On-the-road Price & Installment Calculator */}
        <PriceCalculator
          cars={cars}
          selectedCar={carForCalc}
          onOpenLeadModal={handleOpenLeadModal}
        />

        {/* 6. Events & Handover Gallery with Lightbox */}
        <EventsGallery content={siteContent.gallerySection} />

        {/* 7. News, Magazine & Promos */}
        <NewsSection 
          content={siteContent.newsSection}
          onOpenLeadModal={handleOpenLeadModal} 
        />
      </main>

      {/* 8. Footer */}
      <Footer
        settings={showroomSettings}
        onSelectCarDetail={(car) => setSelectedCarDetail(car)}
        onOpenLeadModal={handleOpenLeadModal}
        onOpenAdminViewer={() => setIsAdminViewerOpen(true)}
      />

      {/* 9. Floating Contact Toolbar */}
      <FloatingToolbar 
        settings={showroomSettings}
        onOpenLeadModal={() => handleOpenLeadModal()} 
      />

      {/* 10. Modals */}
      <CarDetailModal
        settings={showroomSettings}
        car={selectedCarDetail}
        onClose={() => setSelectedCarDetail(null)}
        onOpenLeadModal={handleOpenLeadModal}
        onSelectCarForCalc={handleSelectCarForCalc}
      />

      <LeadModal
        settings={showroomSettings}
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        preselectedModel={leadModel}
        preselectedNeed={leadNeed}
        initialNote={leadNote}
        onLeadSubmitted={async (lead) => {
          await saveNewLead(lead, showroomSettings);
        }}
      />

      <AdminLeadViewer
        isOpen={isAdminViewerOpen}
        onClose={() => setIsAdminViewerOpen(false)}
      />
    </div>
  );
}

export default App;
