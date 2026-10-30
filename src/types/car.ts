export interface CarSpecs {
  engine: string;
  maxPower: string;
  torque: string;
  transmission: string;
  drivetrain: string;
  seats: number;
  dimensions: string; // Dài x Rộng x Cao (mm)
  wheelbase: string; // Chiều dài cơ sở (mm)
  fuelConsumption?: string;
  acceleration?: string;
  topSpeed?: string;
}

export interface CarModel {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: 'suv' | 'mpv' | 'hatchback';
  categoryLabel: string;
  priceText: string;
  priceNumber: number; // in VNĐ (e.g. 2088000000)
  image: string;
  gallery: string[];
  badge?: string;
  highlights: string[];
  specs: CarSpecs;
  features: string[];
  colors: { name: string; hex: string }[];
}

export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  model: string;
  need: string;
  note?: string;
  createdAt: string;
  status?: LeadStatus;
  salesNotes?: string;
}

export interface ShowroomSettings {
  name: string;
  company: string;
  address: string;
  hotline: string;
  hotlineFormatted: string;
  email: string;
  zaloPhone: string;
  zalo: string;
  messenger: string;
  openHours: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  notificationEmail?: string;
  notificationEnabled?: boolean;
  web3FormsAccessKey?: string;
}

export interface HeroSlideContent {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  model: string;
  ctaText: string;
}

export interface BookingStripContent {
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface ShowroomIntroFeature {
  title: string;
  desc: string;
}

export interface ShowroomIntroContent {
  badge: string;
  title: string;
  description: string;
  image: string;
  features: ShowroomIntroFeature[];
}

export interface CarSectionContent {
  badge: string;
  title: string;
  subtitle: string;
}

export interface ActionCardContent {
  title: string;
  description: string;
  buttonText: string;
  image: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'showroom' | 'customer' | 'handover';
  image: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
}

export interface NewsSectionContent {
  badge: string;
  title: string;
  subtitle: string;
  newsItems: NewsItem[];
  magazineCard: ActionCardContent;
  workshopCard: ActionCardContent;
}

export interface GallerySectionContent {
  badge: string;
  title: string;
  subtitle: string;
  items?: EventItem[];
}

export interface SiteContent {
  heroSlides: HeroSlideContent[];
  bookingStrip: BookingStripContent;
  showroomIntro: ShowroomIntroContent;
  carSection: CarSectionContent;
  newsSection: NewsSectionContent;
  gallerySection: GallerySectionContent;
}
