import React, { useState, useEffect } from 'react';
import { 
  Users, Car, Settings, BarChart3, Search, Download, Trash2, 
  Phone, Calendar, CheckCircle2, Clock, 
  Edit3, Plus, Save, RefreshCw, Layout, Image, LogOut, Sparkles, Eye,
  Compass, Cog, Gauge, Users as UsersIcon, BookOpen, Wrench, MessageSquare, Share2, Camera,
  Database, Cloud, Copy, ExternalLink, Check, Mail, Send
} from 'lucide-react';
import type { Lead, CarModel, ShowroomSettings, LeadStatus, SiteContent, HeroSlideContent, NewsItem, EventItem } from '../types/car';
import { CARS_DATA, DEFAULT_SITE_CONTENT } from '../data/carsData';
import { sendTestNotificationEmail } from '../services/emailNotificationService';
import { ImageUploadInput } from './ImageUploadInput';
import { 
  fetchLeads, 
  saveNewLead,
  updateLeadStatusInDb, 
  updateLeadSalesNotesInDb, 
  deleteLeadFromDb, 
  subscribeToLeads,
  saveShowroomSettingsToDb
} from '../services/dataService';
import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY, cleanSupabaseUrl } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

interface AdminDashboardProps {
  onBackToShowroom: () => void;
  onLogout: () => void;
  cars: CarModel[];
  onUpdateCars: (updatedCars: CarModel[]) => void;
  settings: ShowroomSettings;
  onUpdateSettings: (newSettings: ShowroomSettings) => void;
  siteContent: SiteContent;
  onUpdateSiteContent: (newContent: SiteContent) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToShowroom,
  onLogout,
  cars,
  onUpdateCars,
  settings,
  onUpdateSettings,
  siteContent,
  onUpdateSiteContent
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'cars' | 'cms' | 'settings'>('overview');

  // Cloud Database (Supabase) Connection Modal State
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(SUPABASE_URL);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(SUPABASE_ANON_KEY);
  const [copiedSql, setCopiedSql] = useState(false);
  const [dbSaveSuccess, setDbSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddingLead, setIsAddingLead] = useState(false);

  // New Lead Form State
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadModel, setNewLeadModel] = useState(cars[0]?.name || 'Volkswagen Viloran');
  const [newLeadNeed, setNewLeadNeed] = useState('Nhận báo giá');
  const [newLeadNote, setNewLeadNote] = useState('');

  // Car Editing & Creating State
  const [editingCar, setEditingCar] = useState<CarModel | null>(null);
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [editCarForm, setEditCarForm] = useState<Partial<CarModel>>({});

  // Helper function to safely merge siteContent with all default sections
  const getMergedSiteContent = (content: SiteContent): SiteContent => ({
    ...DEFAULT_SITE_CONTENT,
    ...content,
    carSection: content.carSection || DEFAULT_SITE_CONTENT.carSection,
    newsSection: content.newsSection || DEFAULT_SITE_CONTENT.newsSection,
    gallerySection: content.gallerySection || DEFAULT_SITE_CONTENT.gallerySection
  });

  // CMS Site Content Form State
  const [tempSiteContent, setTempSiteContent] = useState<SiteContent>(() => getMergedSiteContent(siteContent));
  const [cmsSavedMsg, setCmsSavedMsg] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideContent | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);

  // News Editing State
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isAddingNews, setIsAddingNews] = useState(false);

  // Gallery Photos Editing State
  const [activeGalleryAdminTab, setActiveGalleryAdminTab] = useState<'all' | 'showroom' | 'customer' | 'handover'>('all');
  const [editingGalleryItem, setEditingGalleryItem] = useState<EventItem | null>(null);
  const [isAddingGalleryItem, setIsAddingGalleryItem] = useState(false);

  // Settings State Form
  const [tempSettings, setTempSettings] = useState<ShowroomSettings>(settings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailMsg, setTestEmailMsg] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  useEffect(() => {
    setTempSiteContent(getMergedSiteContent(siteContent));
  }, [siteContent]);

  // Load Leads from localStorage
  const loadLeads = () => {
    try {
      const data = localStorage.getItem('vw_golden_leads');
      if (data) {
        setLeads(JSON.parse(data));
      } else {
        const sampleLeads: Lead[] = [
          {
            id: 'lead-1',
            fullName: 'Trần Minh Tuấn',
            phone: '0908123456',
            email: 'minhtuan.tran@gmail.com',
            model: 'Volkswagen Viloran',
            need: 'Nhận báo giá',
            note: 'Quan tâm bản Luxury màu đen, cần bảng tính trả góp 4 năm.',
            createdAt: '03/09/2026, 14:32',
            status: 'new'
          },
          {
            id: 'lead-2',
            fullName: 'Nguyễn Bích Ngọc',
            phone: '0912987654',
            email: 'ngoc.nguyen@company.vn',
            model: 'Volkswagen Teramont X',
            need: 'Đăng kí lái thử',
            note: 'Muốn lái thử tại nhà riêng ở Quận 7 vào sáng thứ Bảy.',
            createdAt: '03/09/2026, 11:15',
            status: 'contacted'
          },
          {
            id: 'lead-3',
            fullName: 'Lê Hoàng Nam',
            phone: '0983556677',
            email: 'hoangnam.le@gmail.com',
            model: 'Volkswagen Touareg',
            need: 'Tư vấn trả góp',
            note: 'Cần tư vấn gói vay ngân hàng 80% thời hạn 5 năm.',
            createdAt: '02/09/2026, 16:40',
            status: 'negotiating'
          }
        ];
        setLeads(sampleLeads);
        localStorage.setItem('vw_golden_leads', JSON.stringify(sampleLeads));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // 1. Initial fetch from Supabase (or localStorage fallback)
    fetchLeads().then(data => {
      if (data && data.length > 0) {
        setLeads(data);
      } else {
        loadLeads();
      }
    });

    // 2. Realtime listener: whenever a new lead arrives in Supabase, update instantly!
    const unsubscribe = subscribeToLeads((newLead) => {
      setLeads(prev => {
        if (prev.some(l => l.id === newLead.id)) return prev;
        return [newLead, ...prev];
      });
    });

    return () => unsubscribe();
  }, []);

  const saveLeadsToStorage = (updated: Lead[]) => {
    setLeads(updated);
    localStorage.setItem('vw_golden_leads', JSON.stringify(updated));
  };

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    const updated = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
    saveLeadsToStorage(updated);
    updateLeadStatusInDb(id, newStatus);
  };

  const handleUpdateSalesNotes = (id: string, notes: string) => {
    const updated = leads.map(l => l.id === id ? { ...l, salesNotes: notes } : l);
    saveLeadsToStorage(updated);
    updateLeadSalesNotesInDb(id, notes);
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa khách hàng này khỏi danh sách?')) {
      const updated = leads.filter(l => l.id !== id);
      saveLeadsToStorage(updated);
      deleteLeadFromDb(id);
    }
  };

  const handleAddNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) {
      alert('Vui lòng nhập họ tên và số điện thoại!');
      return;
    }

    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      fullName: newLeadName.trim(),
      phone: newLeadPhone.trim(),
      email: newLeadEmail.trim() || undefined,
      model: newLeadModel,
      need: newLeadNeed,
      note: newLeadNote.trim() || undefined,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'new'
    };

    saveNewLead(newLead);
    const updated = [newLead, ...leads];
    saveLeadsToStorage(updated);
    setIsAddingLead(false);
    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadEmail('');
    setNewLeadNote('');
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Đang kết nối thử tới máy chủ Supabase...');
    try {
      const url = cleanSupabaseUrl(supabaseUrlInput);
      const key = supabaseKeyInput.trim();
      if (!url || !key) {
        setTestStatus('error');
        setTestMessage('Vui lòng nhập đủ URL và Anon Key!');
        return;
      }
      const testClient = createClient(url, key);
      const { error } = await testClient.from('leads').select('id').limit(1);
      if (error) {
        setTestStatus('error');
        if (error.code === '42P01' || error.message.toLowerCase().includes('does not exist') || error.message.toLowerCase().includes('relation')) {
          setTestMessage('⚠️ Kết nối thành công tới Supabase, NHƯNG BẠN CHƯA TẠO BẢNG! Hãy vào mục SQL Editor trên Supabase, dán file "supabase_schema.sql" và bấm RUN.');
        } else {
          setTestMessage(`❌ Lỗi kết nối: ${error.message} (Mã lỗi: ${error.code})`);
        }
      } else {
        setTestStatus('success');
        setTestMessage('✅ KẾT NỐI CHUẨN XÁC 100%! Cơ sở dữ liệu và bảng "leads" đã sẵn sàng hoạt động.');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(`❌ Lỗi: ${err.message || 'Không thể kết nối tới URL này'}`);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedUrl = cleanSupabaseUrl(supabaseUrlInput);
    const cleanedKey = supabaseKeyInput.trim();
    localStorage.setItem('vw_supabase_url', cleanedUrl);
    localStorage.setItem('vw_supabase_anon_key', cleanedKey);
    setDbSaveSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleDisconnectSupabase = () => {
    if (window.confirm('Bạn có chắc muốn ngắt kết nối Supabase và quay về LocalStorage?')) {
      localStorage.removeItem('vw_supabase_url');
      localStorage.removeItem('vw_supabase_anon_key');
      window.location.reload();
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const header = 'ID,Ho_Va_Ten,So_Dien_Thoai,Email,Dong_Xe,Nhu_Cau,Trang_Thai,Ghi_Chu_Khach,Ghi_Chu_Kinh_Doanh,Thoi_Gian\n';
    const rows = leads.map(l => 
      `"${l.id}","${l.fullName}","${l.phone}","${l.email || ''}","${l.model}","${l.need}","${l.status || 'new'}","${l.note || ''}","${l.salesNotes || ''}","${l.createdAt}"`
    ).join('\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_vw_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Car editing & creation handlers
  const handleOpenEditCar = (car: CarModel) => {
    setEditingCar(car);
    setIsAddingCar(false);
    setEditCarForm({
      ...car,
      specs: { ...car.specs }
    });
  };

  const handleOpenAddCar = () => {
    setEditingCar(null);
    setIsAddingCar(true);
    setEditCarForm({
      id: 'car-' + Date.now(),
      name: 'Volkswagen Mới',
      slug: 'volkswagen-moi-' + Date.now(),
      tagline: 'Khám phá dòng xe phong thái đỉnh cao từ Đức',
      category: 'suv',
      categoryLabel: 'SUV / Crossover',
      priceText: 'Giá từ 1 tỷ 999 triệu',
      priceNumber: 1999000000,
      image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-X-1024x683.webp',
      gallery: [],
      badge: 'MỚI RA MẮT',
      highlights: ['Động cơ TSI uy lực', 'Hệ thống an toàn IQ.Drive', 'Nội thất sang trọng'],
      specs: {
        engine: '2.0L TSI Turbo',
        maxPower: '220 HP',
        torque: '350 Nm',
        transmission: '7 cấp DSG',
        drivetrain: '4MOTION',
        seats: 7,
        dimensions: '4800 x 1900 x 1700',
        wheelbase: '2900'
      },
      features: ['Hệ thống an toàn IQ.Drive', 'Cửa sổ trời Panorama'],
      colors: [{ name: 'Trắng Pure White', hex: '#ffffff' }]
    });
  };

  const handleSaveCarForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCarForm.name || !editCarForm.priceText) {
      alert('Vui lòng nhập tên xe và giá bán!');
      return;
    }

    if (isAddingCar) {
      const newCar = editCarForm as CarModel;
      const updated = [...cars, newCar];
      onUpdateCars(updated);
      localStorage.setItem('vw_golden_cars_custom', JSON.stringify(updated));
      setIsAddingCar(false);
      setEditCarForm({});
    } else if (editingCar) {
      const updated = cars.map(c => c.id === editingCar.id ? { ...c, ...editCarForm } as CarModel : c);
      onUpdateCars(updated);
      localStorage.setItem('vw_golden_cars_custom', JSON.stringify(updated));
      setEditingCar(null);
      setEditCarForm({});
    }
  };

  const handleDeleteCar = (carId: string) => {
    if (cars.length <= 1) {
      alert('Phải giữ lại ít nhất 1 dòng xe trên website!');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa mẫu xe này khỏi danh sách hiển thị ngoài trang chủ?')) {
      const updated = cars.filter(c => c.id !== carId);
      onUpdateCars(updated);
      localStorage.setItem('vw_golden_cars_custom', JSON.stringify(updated));
    }
  };

  const handleResetDefaultCars = () => {
    if (window.confirm('Khôi phục danh sách và bảng giá xe về dữ liệu gốc ban đầu của Volkswagen?')) {
      onUpdateCars(CARS_DATA);
      localStorage.removeItem('vw_golden_cars_custom');
    }
  };

  // CMS Handlers
  const handleSaveCMS = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateSiteContent(tempSiteContent);
    localStorage.setItem('vw_golden_site_content', JSON.stringify(tempSiteContent));
    setCmsSavedMsg(true);
    setTimeout(() => setCmsSavedMsg(false), 3000);
  };

  const handleResetCMS = () => {
    if (window.confirm('Khôi phục toàn bộ nội dung trang chủ về mặc định chuẩn Volkswagen Golden?')) {
      setTempSiteContent(DEFAULT_SITE_CONTENT);
      onUpdateSiteContent(DEFAULT_SITE_CONTENT);
      localStorage.removeItem('vw_golden_site_content');
    }
  };

  // Hero Slide Handlers
  const handleDeleteSlide = (id: number) => {
    if (tempSiteContent.heroSlides.length <= 1) {
      alert('Trang chủ cần ít nhất 1 banner slider!');
      return;
    }
    if (window.confirm('Bạn có chắc muốn xóa slide banner này?')) {
      const updatedSlides = tempSiteContent.heroSlides.filter(s => s.id !== id);
      const updated = { ...tempSiteContent, heroSlides: updatedSlides };
      setTempSiteContent(updated);
      onUpdateSiteContent(updated);
      localStorage.setItem('vw_golden_site_content', JSON.stringify(updated));
    }
  };

  const handleSaveSlideEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    const updatedSlides = tempSiteContent.heroSlides.map(s => s.id === editingSlide.id ? editingSlide : s);
    const updated = { ...tempSiteContent, heroSlides: updatedSlides };
    setTempSiteContent(updated);
    onUpdateSiteContent(updated);
    localStorage.setItem('vw_golden_site_content', JSON.stringify(updated));
    setEditingSlide(null);
  };

  const handleAddNewSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    const newSlide: HeroSlideContent = {
      ...editingSlide,
      id: Date.now()
    };

    const updated = {
      ...tempSiteContent,
      heroSlides: [...tempSiteContent.heroSlides, newSlide]
    };

    setTempSiteContent(updated);
    onUpdateSiteContent(updated);
    localStorage.setItem('vw_golden_site_content', JSON.stringify(updated));
    setIsAddingSlide(false);
    setEditingSlide(null);
  };

  // News Items Handlers (Hình 2)
  const handleSaveNewsItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    const currentItems = tempSiteContent.newsSection?.newsItems || DEFAULT_SITE_CONTENT.newsSection.newsItems;

    if (isAddingNews) {
      const newItem: NewsItem = {
        ...editingNews,
        id: 'news-' + Date.now()
      };
      const updated = {
        ...tempSiteContent,
        newsSection: {
          ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
          newsItems: [newItem, ...currentItems]
        }
      };
      setTempSiteContent(updated);
      onUpdateSiteContent(updated);
      localStorage.setItem('vw_golden_site_content', JSON.stringify(updated));
      setIsAddingNews(false);
      setEditingNews(null);
    } else {
      const updatedItems = currentItems.map(item => item.id === editingNews.id ? editingNews : item);
      const updated = {
        ...tempSiteContent,
        newsSection: {
          ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
          newsItems: updatedItems
        }
      };
      setTempSiteContent(updated);
      onUpdateSiteContent(updated);
      localStorage.setItem('vw_golden_site_content', JSON.stringify(updated));
      setEditingNews(null);
    }
  };

  const handleDeleteNewsItem = (id: string) => {
    const currentItems = tempSiteContent.newsSection?.newsItems || DEFAULT_SITE_CONTENT.newsSection.newsItems;
    if (currentItems.length <= 1) {
      alert('Mục tin tức cần ít nhất 1 bài viết!');
      return;
    }
    if (window.confirm('Bạn có chắc muốn xóa bài viết tin tức này?')) {
      const updatedItems = currentItems.filter(item => item.id !== id);
      const updated = {
        ...tempSiteContent,
        newsSection: {
          ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
          newsItems: updatedItems
        }
      };
      setTempSiteContent(updated);
      onUpdateSiteContent(updated);
      localStorage.setItem('vw_golden_site_content', JSON.stringify(updated));
    }
  };

  // Gallery Photos Handlers (Hình Ảnh Bàn Giao & Trải Nghiệm Khách Hàng)
  const handleSaveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;

    const currentItems = tempSiteContent.gallerySection?.items || DEFAULT_SITE_CONTENT.gallerySection.items || [];

    if (isAddingGalleryItem) {
      const newItem: EventItem = {
        ...editingGalleryItem,
        id: 'event-' + Date.now()
      };
      const updated = {
        ...tempSiteContent,
        gallerySection: {
          ...(tempSiteContent.gallerySection || DEFAULT_SITE_CONTENT.gallerySection),
          items: [newItem, ...currentItems]
        }
      };
      setTempSiteContent(updated);
      onUpdateSiteContent(updated);
      localStorage.setItem('vw_golden_site_content', JSON.stringify(updated));
      setIsAddingGalleryItem(false);
      setEditingGalleryItem(null);
    } else {
      const updatedItems = currentItems.map(item => item.id === editingGalleryItem.id ? editingGalleryItem : item);
      const updated = {
        ...tempSiteContent,
        gallerySection: {
          ...(tempSiteContent.gallerySection || DEFAULT_SITE_CONTENT.gallerySection),
          items: updatedItems
        }
      };
      setTempSiteContent(updated);
      onUpdateSiteContent(updated);
      localStorage.setItem('vw_golden_site_content', JSON.stringify(updated));
      setEditingGalleryItem(null);
    }
  };

  const handleDeleteGalleryItem = (id: string) => {
    const currentItems = tempSiteContent.gallerySection?.items || DEFAULT_SITE_CONTENT.gallerySection.items || [];
    if (currentItems.length <= 1) {
      alert('Thư viện cần ít nhất 1 hình ảnh!');
      return;
    }
    if (window.confirm('Bạn có chắc muốn xóa bức ảnh này khỏi thư viện website?')) {
      const updatedItems = currentItems.filter(item => item.id !== id);
      const updated = {
        ...tempSiteContent,
        gallerySection: {
          ...(tempSiteContent.gallerySection || DEFAULT_SITE_CONTENT.gallerySection),
          items: updatedItems
        }
      };
      setTempSiteContent(updated);
      onUpdateSiteContent(updated);
      localStorage.setItem('vw_golden_site_content', JSON.stringify(updated));
    }
  };

  const handleResetDefaultGallery = () => {
    if (window.confirm('Khôi phục toàn bộ hình ảnh sự kiện về danh sách gốc ban đầu của showroom?')) {
      const updated = {
        ...tempSiteContent,
        gallerySection: {
          ...(tempSiteContent.gallerySection || DEFAULT_SITE_CONTENT.gallerySection),
          items: DEFAULT_SITE_CONTENT.gallerySection.items
        }
      };
      setTempSiteContent(updated);
      onUpdateSiteContent(updated);
      localStorage.setItem('vw_golden_site_content', JSON.stringify(updated));
    }
  };

  // Settings save handler (Đồng bộ Messenger, Hotline, Zalo, Showroom info, Email Notification)
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: ShowroomSettings = {
      ...tempSettings,
      zalo: `https://zalo.me/${tempSettings.zaloPhone.replace(/\s+/g, '')}`,
      hotlineFormatted: tempSettings.hotlineFormatted || tempSettings.hotline,
      messenger: tempSettings.messenger || 'http://m.me/649644434900717',
      notificationEmail: (tempSettings.notificationEmail || tempSettings.email || '').trim(),
      notificationEnabled: tempSettings.notificationEnabled !== false,
      web3FormsAccessKey: (tempSettings.web3FormsAccessKey || '').trim()
    };
    onUpdateSettings(updatedSettings);
    localStorage.setItem('vw_golden_showroom_settings', JSON.stringify(updatedSettings));
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  const handleTestEmail = async () => {
    const targetEmail = (tempSettings.notificationEmail || tempSettings.email || '').trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      alert('Vui lòng nhập địa chỉ email cá nhân hợp lệ trước khi gửi thử!');
      return;
    }
    setIsSendingTestEmail(true);
    setTestEmailMsg(null);
    try {
      const res = await sendTestNotificationEmail(targetEmail, tempSettings.name, tempSettings.web3FormsAccessKey);
      setTestEmailMsg({
        success: res.success,
        text: res.message
      });

      if (res.success) {
        // Tự động lưu luôn email vào cài đặt & hệ thống để không bị mất!
        const autoSavedSettings: ShowroomSettings = {
          ...tempSettings,
          notificationEmail: targetEmail,
          notificationEnabled: true,
          web3FormsAccessKey: (tempSettings.web3FormsAccessKey || '').trim()
        };
        setTempSettings(autoSavedSettings);
        onUpdateSettings(autoSavedSettings);
        localStorage.setItem('vw_golden_showroom_settings', JSON.stringify(autoSavedSettings));
        saveShowroomSettingsToDb(autoSavedSettings);
      }
    } catch (err: any) {
      setTestEmailMsg({
        success: false,
        text: `Lỗi: ${err.message || 'Không thể gửi email kiểm tra'}`
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Filtered leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || (lead.status || 'new') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats calculation
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => (l.status || 'new') === 'new').length;
  const inProgressCount = leads.filter(l => l.status === 'contacted' || l.status === 'negotiating').length;
  const wonCount = leads.filter(l => l.status === 'won').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Admin Topbar */}
      <header className="bg-vw-blue text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white text-vw-blue flex items-center justify-center font-black p-1 shadow">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4.5" />
                <path d="M 28,26 L 44,74 L 50,56 L 56,74 L 72,26 L 62,26 L 53,53 L 50,44 L 53,35 L 61,35 L 63,26 L 37,26 L 39,35 L 47,35 L 50,44 L 47,53 L 38,26 Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wide uppercase">VOLKSWAGEN GOLDEN</span>
                <span className="px-2 py-0.5 rounded bg-vw-cyan text-vw-dark text-[10px] font-black uppercase">
                  Admin CMS & CRM
                </span>
              </div>
              <span className="text-[11px] text-slate-300 block">
                Đang đăng nhập: <strong>{sessionStorage.getItem('vw_admin_user') || 'admin'}</strong> (Ban Quản Trị)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Supabase Status Pill */}
            <button
              type="button"
              onClick={() => setIsDbModalOpen(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border ${
                isSupabaseConfigured()
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-200 border-amber-400/40 hover:bg-amber-500/30'
              }`}
              title="Bấm để cấu hình kết nối Cloud Database Supabase"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isSupabaseConfigured() ? 'Cloud Database (Online)' : 'LocalStorage (Bấm Kết Nối Cloud)'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            </button>

            <button
              onClick={onBackToShowroom}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors border border-white/20"
              title="Xem trang web bán xe ngoài trang chủ"
            >
              <Eye className="w-4 h-4" />
              <span>Xem Website</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              title="Đăng xuất khỏi trang quản trị"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng Xuất</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-vw-blue text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tổng Quan Hoạt Động</span>
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cms'
                ? 'bg-vw-blue text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layout className="w-4 h-4 text-vw-cyan" />
            <span>Quản Lý Giao Diện Trang Chủ (CMS)</span>
          </button>

          <button
            onClick={() => setActiveTab('cars')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cars'
                ? 'bg-vw-blue text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Bảng Giá & Dòng Xe ({cars.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'leads'
                ? 'bg-vw-blue text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Khách Hàng Đăng Ký ({totalLeadsCount})</span>
            {newLeadsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-vw-red text-white text-[10px] font-black">
                {newLeadsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-vw-blue text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cài Đặt Showroom, Hotline & Messenger</span>
          </button>
        </div>

        {/* TAB: CMS - MAIN UI CONTENT EDITOR */}
        {activeTab === 'cms' && (
          <div className="space-y-8">
            
            {/* CMS Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-vw-cyan" />
                  <h3 className="text-lg font-black text-vw-blue">
                    Trình Biên Tập Giao Diện Trang Chủ (Live CMS Toàn Diện)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa banner slider, thông điệp ưu đãi, giới thiệu showroom, tiêu đề xe, 2 khối hành động (Tạp chí / Xưởng dịch vụ) và tin tức. Mọi thay đổi sẽ ngay lập tức hiển thị trên trang chủ!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetCMS}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Khôi Phục Mặc Định</span>
                </button>

                <button
                  onClick={() => handleSaveCMS()}
                  className="px-6 py-2.5 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl text-xs font-black uppercase tracking-wider shadow flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Toàn Bộ Giao Diện</span>
                </button>
              </div>
            </div>

            {cmsSavedMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Đã lưu thành công! Bạn có thể bấm "Xem Website" để kiểm tra giao diện trang chủ vừa được cập nhật.</span>
              </div>
            )}

            {/* Sub-section 1: Hero Banner Slider */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-base font-extrabold text-vw-blue flex items-center gap-2">
                    <Image className="w-4 h-4 text-vw-cyan" />
                    <span>1. Quản Lý Banner Slider Đầu Trang ({tempSiteContent.heroSlides.length} Slide)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thêm, xóa hoặc chỉnh sửa hình ảnh, tiêu đề và nút kêu gọi hành động của các banner xoay tua.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingSlide({
                      id: 0,
                      badge: 'ƯU ĐÃI ĐẶC QUYỀN MỚI',
                      title: 'TIÊU ĐỀ SLIDE BANNER MỚI',
                      subtitle: 'Mô tả ngắn gọn ưu đãi hấp dẫn dành cho khách hàng...',
                      image: 'https://volkswagengolden.vn/wp-content/uploads/2026/08/1111111.jpg',
                      model: 'Volkswagen Viloran',
                      ctaText: 'NHẬN BÁO GIÁ'
                    });
                    setIsAddingSlide(true);
                  }}
                  className="px-4 py-2 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Slide Banner Mới</span>
                </button>
              </div>

              {/* Slider List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tempSiteContent.heroSlides.map((slide, idx) => (
                  <div key={slide.id || idx} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="aspect-[16/9] relative bg-slate-200">
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                          Slide #{idx + 1}
                        </span>
                      </div>
                      <div className="p-4 space-y-2 text-xs">
                        <span className="text-[10px] font-bold text-vw-cyan uppercase block">{slide.badge}</span>
                        <h5 className="font-extrabold text-slate-800 text-sm line-clamp-2 leading-snug">{slide.title}</h5>
                        <p className="text-slate-500 line-clamp-2 text-[11px]">{slide.subtitle}</p>
                        <div className="text-slate-400 text-[10px]">
                          <strong>Nút bấm:</strong> {slide.ctaText} • <strong>Xe:</strong> {slide.model}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingSlide(slide);
                          setIsAddingSlide(false);
                        }}
                        className="flex-1 py-1.5 bg-white hover:bg-vw-blue hover:text-white border border-slate-300 text-slate-700 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa Slide</span>
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Xóa slide này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Modal: Edit or Add Slide */}
            {editingSlide && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-vw-blue text-base">
                      {isAddingSlide ? 'Thêm Slide Banner Mới' : 'Chỉnh Sửa Slide Banner'}
                    </h4>
                    <button onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>

                  <form onSubmit={isAddingSlide ? handleAddNewSlide : handleSaveSlideEdit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nhãn tiêu đề nhỏ (Badge)</label>
                      <input
                        type="text"
                        required
                        value={editingSlide.badge}
                        onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tiêu đề chính (Title in hoa)</label>
                      <input
                        type="text"
                        required
                        value={editingSlide.title}
                        onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mô tả phụ (Subtitle)</label>
                      <textarea
                        rows={2}
                        required
                        value={editingSlide.subtitle}
                        onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <ImageUploadInput
                      label="Hình ảnh Banner Slider"
                      value={editingSlide.image}
                      onChange={(img) => setEditingSlide({ ...editingSlide, image: img })}
                      required
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Chữ hiển thị nút bấm</label>
                        <input
                          type="text"
                          required
                          value={editingSlide.ctaText}
                          onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Dòng xe liên kết</label>
                        <select
                          value={editingSlide.model}
                          onChange={(e) => setEditingSlide({ ...editingSlide, model: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                        >
                          {cars.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingSlide(null)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-vw-blue text-white font-bold"
                      >
                        {isAddingSlide ? 'Thêm Slide' : 'Lưu Thay Đổi'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Sub-section 2: Booking Strip */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-base font-extrabold text-vw-blue flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="w-4 h-4 text-vw-cyan" />
                <span>2. Dải Banner Khuyến Mãi Tức Thì (Booking Strip)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
                <div className="sm:col-span-6">
                  <label className="block font-bold text-slate-700 mb-1">Tiêu đề thông điệp</label>
                  <input
                    type="text"
                    value={tempSiteContent.bookingStrip.title}
                    onChange={(e) => setTempSiteContent({
                      ...tempSiteContent,
                      bookingStrip: { ...tempSiteContent.bookingStrip, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-bold text-slate-700 mb-1">Mô tả phụ</label>
                  <input
                    type="text"
                    value={tempSiteContent.bookingStrip.subtitle}
                    onChange={(e) => setTempSiteContent({
                      ...tempSiteContent,
                      bookingStrip: { ...tempSiteContent.bookingStrip, subtitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Chữ trên nút</label>
                  <input
                    type="text"
                    value={tempSiteContent.bookingStrip.buttonText}
                    onChange={(e) => setTempSiteContent({
                      ...tempSiteContent,
                      bookingStrip: { ...tempSiteContent.bookingStrip, buttonText: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-vw-red"
                  />
                </div>
              </div>
            </div>

            {/* Sub-section 3: Showroom Urban Store Intro */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h4 className="text-base font-extrabold text-vw-blue flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layout className="w-4 h-4 text-vw-cyan" />
                <span>3. Khối Giới Thiệu Showroom (Urban Store Experience)</span>
              </h4>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Huy hiệu nhỏ</label>
                    <input
                      type="text"
                      value={tempSiteContent.showroomIntro.badge}
                      onChange={(e) => setTempSiteContent({
                        ...tempSiteContent,
                        showroomIntro: { ...tempSiteContent.showroomIntro, badge: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                    />
                  </div>

                  <div>
                    <ImageUploadInput
                      label="Hình ảnh Showroom"
                      value={tempSiteContent.showroomIntro.image}
                      onChange={(img) => setTempSiteContent({
                        ...tempSiteContent,
                        showroomIntro: { ...tempSiteContent.showroomIntro, image: img }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiêu đề chính khối giới thiệu</label>
                  <input
                    type="text"
                    value={tempSiteContent.showroomIntro.title}
                    onChange={(e) => setTempSiteContent({
                      ...tempSiteContent,
                      showroomIntro: { ...tempSiteContent.showroomIntro, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-sm text-vw-blue"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đoạn văn giới thiệu chi tiết</label>
                  <textarea
                    rows={3}
                    value={tempSiteContent.showroomIntro.description}
                    onChange={(e) => setTempSiteContent({
                      ...tempSiteContent,
                      showroomIntro: { ...tempSiteContent.showroomIntro, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl leading-relaxed"
                  />
                </div>

                {/* 4 Feature Highlights */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">4 Điểm Nhấn Nổi Bật</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tempSiteContent.showroomIntro.features.map((feat, fIdx) => (
                      <div key={fIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <input
                          type="text"
                          placeholder="Tiêu đề điểm nhấn..."
                          value={feat.title}
                          onChange={(e) => {
                            const newFeatures = [...tempSiteContent.showroomIntro.features];
                            newFeatures[fIdx] = { ...newFeatures[fIdx], title: e.target.value };
                            setTempSiteContent({
                              ...tempSiteContent,
                              showroomIntro: { ...tempSiteContent.showroomIntro, features: newFeatures }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold text-vw-blue"
                        />
                        <input
                          type="text"
                          placeholder="Mô tả điểm nhấn..."
                          value={feat.desc}
                          onChange={(e) => {
                            const newFeatures = [...tempSiteContent.showroomIntro.features];
                            newFeatures[fIdx] = { ...newFeatures[fIdx], desc: e.target.value };
                            setTempSiteContent({
                              ...tempSiteContent,
                              showroomIntro: { ...tempSiteContent.showroomIntro, features: newFeatures }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px] text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleSaveCMS()}
                  className="px-6 py-3 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Thay Đổi Giới Thiệu Showroom</span>
                </button>
              </div>

            </div>

            {/* Sub-section 4: Car Showcase Section Header */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-base font-extrabold text-vw-blue flex items-center gap-2">
                    <Car className="w-4 h-4 text-vw-cyan" />
                    <span>4. Tiêu Đề & Giới Thiệu Khối Dòng Xe Nổi Bật (Bảng Giá & Dòng Xe)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tùy chỉnh văn bản tiêu đề hiển thị ngay trên lưới 8 dòng xe Volkswagen ngoài trang chủ.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('cars')}
                  className="text-xs font-bold text-vw-cyan hover:underline flex items-center gap-1"
                >
                  <span>Chỉnh sửa chi tiết từng mẫu xe &rarr;</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nhãn nhỏ trên đầu (Badge)</label>
                    <input
                      type="text"
                      value={tempSiteContent.carSection?.badge || ''}
                      onChange={(e) => setTempSiteContent({
                        ...tempSiteContent,
                        carSection: {
                          ...(tempSiteContent.carSection || DEFAULT_SITE_CONTENT.carSection),
                          badge: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-vw-cyan tracking-wider uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tiêu đề chính mục xe</label>
                    <input
                      type="text"
                      value={tempSiteContent.carSection?.title || ''}
                      onChange={(e) => setTempSiteContent({
                        ...tempSiteContent,
                        carSection: {
                          ...(tempSiteContent.carSection || DEFAULT_SITE_CONTENT.carSection),
                          title: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-extrabold text-vw-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đoạn mô tả phụ dưới tiêu đề</label>
                  <textarea
                    rows={2}
                    value={tempSiteContent.carSection?.subtitle || ''}
                    onChange={(e) => setTempSiteContent({
                      ...tempSiteContent,
                      carSection: {
                        ...(tempSiteContent.carSection || DEFAULT_SITE_CONTENT.carSection),
                        subtitle: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveCMS()}
                  className="px-6 py-2.5 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Tiêu Đề Khối Xe</span>
                </button>
              </div>
            </div>

            {/* Sub-section 5: Quản lý 2 Thẻ Hành Động Lớn (Tạp Chí Volkswagen & Xưởng Dịch Vụ - TRONG ẢNH 2) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-base font-extrabold text-vw-blue flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-vw-cyan" />
                  <span>5. Quản Lý 2 Khối Hành Động Lớn (Tạp Chí & Đặt Hẹn Dịch Vụ)</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chỉnh sửa trực tiếp 2 thẻ banner lớn ở cuối trang (Tạp chí thương hiệu và Đặt lịch bảo dưỡng xưởng dịch vụ).
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                
                {/* Thẻ 1: Tạp chí Volkswagen */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-vw-blue font-extrabold text-sm pb-1 border-b border-slate-200">
                    <BookOpen className="w-4 h-4 text-vw-cyan" />
                    <span>Thẻ 1: Tạp chí Volkswagen</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tiêu đề thẻ</label>
                    <input
                      type="text"
                      value={tempSiteContent.newsSection?.magazineCard?.title || ''}
                      onChange={(e) => setTempSiteContent({
                        ...tempSiteContent,
                        newsSection: {
                          ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
                          magazineCard: {
                            ...(tempSiteContent.newsSection?.magazineCard || DEFAULT_SITE_CONTENT.newsSection.magazineCard),
                            title: e.target.value
                          }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Đoạn mô tả ngắn</label>
                    <textarea
                      rows={2}
                      value={tempSiteContent.newsSection?.magazineCard?.description || ''}
                      onChange={(e) => setTempSiteContent({
                        ...tempSiteContent,
                        newsSection: {
                          ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
                          magazineCard: {
                            ...(tempSiteContent.newsSection?.magazineCard || DEFAULT_SITE_CONTENT.newsSection.magazineCard),
                            description: e.target.value
                          }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Chữ trên nút bấm</label>
                    <input
                      type="text"
                      value={tempSiteContent.newsSection?.magazineCard?.buttonText || ''}
                      onChange={(e) => setTempSiteContent({
                        ...tempSiteContent,
                        newsSection: {
                          ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
                          magazineCard: {
                            ...(tempSiteContent.newsSection?.magazineCard || DEFAULT_SITE_CONTENT.newsSection.magazineCard),
                            buttonText: e.target.value
                          }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-vw-cyan"
                    />
                  </div>

                  <ImageUploadInput
                    label="Hình ảnh nền Tạp chí"
                    value={tempSiteContent.newsSection?.magazineCard?.image || ''}
                    onChange={(img) => setTempSiteContent({
                      ...tempSiteContent,
                      newsSection: {
                        ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
                        magazineCard: {
                          ...(tempSiteContent.newsSection?.magazineCard || DEFAULT_SITE_CONTENT.newsSection.magazineCard),
                          image: img
                        }
                      }
                    })}
                  />
                </div>

                {/* Thẻ 2: Đặt Hẹn Dịch Vụ & Bảo Dưỡng */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-vw-red font-extrabold text-sm pb-1 border-b border-slate-200">
                    <Wrench className="w-4 h-4" />
                    <span>Thẻ 2: Đặt Hẹn Dịch Vụ & Bảo Dưỡng</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tiêu đề thẻ</label>
                    <input
                      type="text"
                      value={tempSiteContent.newsSection?.workshopCard?.title || ''}
                      onChange={(e) => setTempSiteContent({
                        ...tempSiteContent,
                        newsSection: {
                          ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
                          workshopCard: {
                            ...(tempSiteContent.newsSection?.workshopCard || DEFAULT_SITE_CONTENT.newsSection.workshopCard),
                            title: e.target.value
                          }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Đoạn mô tả ngắn</label>
                    <textarea
                      rows={2}
                      value={tempSiteContent.newsSection?.workshopCard?.description || ''}
                      onChange={(e) => setTempSiteContent({
                        ...tempSiteContent,
                        newsSection: {
                          ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
                          workshopCard: {
                            ...(tempSiteContent.newsSection?.workshopCard || DEFAULT_SITE_CONTENT.newsSection.workshopCard),
                            description: e.target.value
                          }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Chữ trên nút bấm</label>
                    <input
                      type="text"
                      value={tempSiteContent.newsSection?.workshopCard?.buttonText || ''}
                      onChange={(e) => setTempSiteContent({
                        ...tempSiteContent,
                        newsSection: {
                          ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
                          workshopCard: {
                            ...(tempSiteContent.newsSection?.workshopCard || DEFAULT_SITE_CONTENT.newsSection.workshopCard),
                            buttonText: e.target.value
                          }
                        }
                      })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-vw-red"
                    />
                  </div>

                  <ImageUploadInput
                    label="Hình ảnh nền Xưởng dịch vụ"
                    value={tempSiteContent.newsSection?.workshopCard?.image || ''}
                    onChange={(img) => setTempSiteContent({
                      ...tempSiteContent,
                      newsSection: {
                        ...(tempSiteContent.newsSection || DEFAULT_SITE_CONTENT.newsSection),
                        workshopCard: {
                          ...(tempSiteContent.newsSection?.workshopCard || DEFAULT_SITE_CONTENT.newsSection.workshopCard),
                          image: img
                        }
                      }
                    })}
                  />
                </div>

              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveCMS()}
                  className="px-6 py-2.5 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu 2 Khối Hành Động</span>
                </button>
              </div>
            </div>

            {/* Sub-section 6: Quản lý Tin Tức & Khuyến Mãi (4 bài viết trong ảnh 2) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-base font-extrabold text-vw-blue flex items-center gap-2">
                    <Layout className="w-4 h-4 text-vw-cyan" />
                    <span>6. Quản Lý Bài Viết Tin Tức & Khuyến Mãi ({tempSiteContent.newsSection?.newsItems?.length || 4} Bài Viết)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thêm, xóa hoặc chỉnh sửa nội dung 4 bài viết tin tức ngoài trang chủ.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingNews({
                      id: '',
                      title: 'Tiêu đề bài viết tin tức mới',
                      date: 'Tháng 9, 2026',
                      excerpt: 'Tóm tắt nội dung bài viết tin tức ưu đãi hoặc hoạt động mới...',
                      image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/NTT05987-1024x683.jpg',
                      category: 'Khuyến mãi',
                      readTime: '3 phút đọc'
                    });
                    setIsAddingNews(true);
                  }}
                  className="px-4 py-2 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Bài Viết Mới</span>
                </button>
              </div>

              {/* News Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(tempSiteContent.newsSection?.newsItems || DEFAULT_SITE_CONTENT.newsSection.newsItems).map((news) => (
                  <div key={news.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="aspect-[16/10] bg-slate-200 relative overflow-hidden">
                        <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-vw-blue text-white text-[10px] font-bold">
                          {news.category}
                        </span>
                      </div>

                      <div className="p-4 space-y-2 text-xs">
                        <span className="text-[10px] text-slate-400 block">{news.date} • {news.readTime}</span>
                        <h5 className="font-extrabold text-vw-blue text-sm line-clamp-2 leading-snug">{news.title}</h5>
                        <p className="text-slate-500 line-clamp-2 text-[11px]">{news.excerpt}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingNews(news);
                          setIsAddingNews(false);
                        }}
                        className="flex-1 py-1.5 bg-white hover:bg-vw-blue hover:text-white border border-slate-300 text-slate-700 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDeleteNewsItem(news.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Xóa bài viết này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Modal: Edit or Add News Article */}
            {editingNews && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-vw-blue text-base">
                      {isAddingNews ? 'Thêm Bài Viết Mới' : 'Chỉnh Sửa Bài Viết'}
                    </h4>
                    <button onClick={() => setEditingNews(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>

                  <form onSubmit={handleSaveNewsItem} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài viết *</label>
                      <input
                        type="text"
                        required
                        value={editingNews.title}
                        onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Chuyên mục</label>
                        <input
                          type="text"
                          required
                          value={editingNews.category}
                          onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                          placeholder="Tin Showroom, Khuyến mãi..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Thời gian đọc</label>
                        <input
                          type="text"
                          value={editingNews.readTime}
                          onChange={(e) => setEditingNews({ ...editingNews, readTime: e.target.value })}
                          placeholder="3 phút đọc"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    <ImageUploadInput
                      label="Hình ảnh đại diện bài viết"
                      value={editingNews.image}
                      onChange={(img) => setEditingNews({ ...editingNews, image: img })}
                      required
                    />

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Đoạn tóm tắt nội dung *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingNews.excerpt}
                        onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingNews(null)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-vw-blue text-white font-bold"
                      >
                        {isAddingNews ? 'Thêm Bài Viết' : 'Lưu Thay Đổi'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Sub-section 7: Quản Lý Toàn Diện Thư Viện Ảnh Bàn Giao & Trải Nghiệm (HÌNH ẢNH USER YÊU CẦU) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-base font-extrabold text-vw-blue flex items-center gap-2">
                    <Camera className="w-5 h-5 text-vw-cyan" />
                    <span>7. Quản Lý Thư Viện Hình Ảnh Thực Tế & Bàn Giao ({tempSiteContent.gallerySection?.items?.length || 18} Hình Ảnh)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tùy chỉnh tiêu đề và toàn bộ các hình ảnh trong 3 chuyên mục: Giới thiệu Showroom, Khách hàng tại Showroom, và Lễ bàn giao xe.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetDefaultGallery}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Khôi phục lại toàn bộ ảnh gốc ban đầu"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Khôi Phục Ảnh Gốc</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingGalleryItem({
                        id: '',
                        title: 'Khoảnh khắc khách hàng nhận xe tại Volkswagen',
                        category: activeGalleryAdminTab === 'all' ? 'customer' : activeGalleryAdminTab,
                        image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/547516662_122135378666890035_9047339835802051257_n-1024x817.jpg'
                      });
                      setIsAddingGalleryItem(true);
                    }}
                    className="px-4 py-1.5 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Hình Ảnh Mới</span>
                  </button>
                </div>
              </div>

              {/* Tiêu đề & Giới thiệu khối ảnh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Huy hiệu nhỏ (Badge)</label>
                  <input
                    type="text"
                    value={tempSiteContent.gallerySection?.badge || ''}
                    onChange={(e) => setTempSiteContent({
                      ...tempSiteContent,
                      gallerySection: {
                        ...(tempSiteContent.gallerySection || DEFAULT_SITE_CONTENT.gallerySection),
                        badge: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-vw-cyan uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiêu đề chính mục hình ảnh</label>
                  <input
                    type="text"
                    value={tempSiteContent.gallerySection?.title || ''}
                    onChange={(e) => setTempSiteContent({
                      ...tempSiteContent,
                      gallerySection: {
                        ...(tempSiteContent.gallerySection || DEFAULT_SITE_CONTENT.gallerySection),
                        title: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-extrabold text-vw-blue"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Đoạn mô tả phụ</label>
                  <textarea
                    rows={2}
                    value={tempSiteContent.gallerySection?.subtitle || ''}
                    onChange={(e) => setTempSiteContent({
                      ...tempSiteContent,
                      gallerySection: {
                        ...(tempSiteContent.gallerySection || DEFAULT_SITE_CONTENT.gallerySection),
                        subtitle: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Category Filter Tabs */}
              {(() => {
                const allGalleryItems = tempSiteContent.gallerySection?.items || DEFAULT_SITE_CONTENT.gallerySection.items || [];
                const showroomCount = allGalleryItems.filter(i => i.category === 'showroom').length;
                const customerCount = allGalleryItems.filter(i => i.category === 'customer').length;
                const handoverCount = allGalleryItems.filter(i => i.category === 'handover').length;

                const displayedItems = activeGalleryAdminTab === 'all'
                  ? allGalleryItems
                  : allGalleryItems.filter(i => i.category === activeGalleryAdminTab);

                return (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                      <button
                        type="button"
                        onClick={() => setActiveGalleryAdminTab('all')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                          activeGalleryAdminTab === 'all'
                            ? 'bg-vw-blue text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Tất Cả ({allGalleryItems.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveGalleryAdminTab('showroom')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                          activeGalleryAdminTab === 'showroom'
                            ? 'bg-vw-blue text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Giới Thiệu Showroom ({showroomCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveGalleryAdminTab('customer')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                          activeGalleryAdminTab === 'customer'
                            ? 'bg-vw-blue text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Khách Hàng Tại Showroom ({customerCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveGalleryAdminTab('handover')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                          activeGalleryAdminTab === 'handover'
                            ? 'bg-vw-blue text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Lễ Bàn Giao Xe Mới ({handoverCount})
                      </button>
                    </div>

                    {/* Gallery Images Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {displayedItems.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:border-vw-cyan transition-all"
                        >
                          <div>
                            <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow ${
                                item.category === 'customer' ? 'bg-amber-600' :
                                item.category === 'handover' ? 'bg-emerald-600' : 'bg-vw-blue'
                              }`}>
                                {item.category === 'customer' ? 'Khách hàng' : item.category === 'handover' ? 'Bàn giao' : 'Showroom'}
                              </span>
                            </div>

                            <div className="p-2.5">
                              <p className="text-[11px] font-bold text-slate-700 line-clamp-2 leading-snug">
                                {item.title}
                              </p>
                            </div>
                          </div>

                          <div className="p-2.5 pt-0 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingGalleryItem(item);
                                setIsAddingGalleryItem(false);
                              }}
                              className="flex-1 py-1 bg-white hover:bg-vw-blue hover:text-white border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Sửa</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                              title="Xóa bức ảnh này"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveCMS()}
                  className="px-6 py-2.5 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Thư Viện Hình Ảnh</span>
                </button>
              </div>

            </div>

            {/* Modal: Edit or Add Gallery Image */}
            {editingGalleryItem && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-vw-blue text-base">
                      {isAddingGalleryItem ? 'Thêm Hình Ảnh Mới Vào Thư Viện' : 'Chỉnh Sửa Hình Ảnh Thư Viện'}
                    </h4>
                    <button onClick={() => setEditingGalleryItem(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>

                  <form onSubmit={handleSaveGalleryItem} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Chuyên mục Album *</label>
                      <select
                        value={editingGalleryItem.category}
                        onChange={(e) => setEditingGalleryItem({
                          ...editingGalleryItem,
                          category: e.target.value as 'showroom' | 'customer' | 'handover'
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-vw-blue"
                      >
                        <option value="showroom">Giới thiệu Showroom</option>
                        <option value="customer">Khách hàng tại Showroom (Hình ảnh trong ảnh bạn gửi)</option>
                        <option value="handover">Lễ bàn giao xe mới</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tiêu đề / Chú thích ảnh *</label>
                      <input
                        type="text"
                        required
                        value={editingGalleryItem.title}
                        onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                        placeholder="Ví dụ: Bàn giao xe Volkswagen Viloran cho khách hàng..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                      />
                    </div>

                    <ImageUploadInput
                      label="Hình ảnh sự kiện / Bàn giao xe"
                      value={editingGalleryItem.image}
                      onChange={(img) => setEditingGalleryItem({ ...editingGalleryItem, image: img })}
                      required
                    />

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingGalleryItem(null)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-vw-blue text-white font-bold shadow"
                      >
                        {isAddingGalleryItem ? 'Thêm Vào Thư Viện' : 'Lưu Thay Đổi'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Tổng Khách Hàng
                  </span>
                  <div className="text-3xl font-black text-vw-blue">{totalLeadsCount}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    Đã đăng ký tư vấn
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-vw-blue flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Chưa Xử Lý (Mới)
                  </span>
                  <div className="text-3xl font-black text-vw-red">{newLeadsCount}</div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Cần gọi điện ngay
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-vw-red flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Đang Đàm Phán
                  </span>
                  <div className="text-3xl font-black text-amber-500">{inProgressCount}</div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Đang lái thử / tính giá
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Đã Chốt Mua Xe
                  </span>
                  <div className="text-3xl font-black text-emerald-600">{wonCount}</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    Thành công 🎉
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Leads (8 cols) */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-extrabold text-vw-blue">
                    Khách Hàng Gần Đây
                  </h3>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs font-bold text-vw-cyan hover:underline"
                  >
                    Xem tất cả ({leads.length}) &rarr;
                  </button>
                </div>

                {leads.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">Chưa có khách hàng nào.</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {leads.slice(0, 5).map(lead => (
                      <div key={lead.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">{lead.fullName}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              lead.status === 'won' ? 'bg-emerald-100 text-emerald-700' :
                              lead.status === 'negotiating' ? 'bg-amber-100 text-amber-700' :
                              lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {lead.status === 'won' ? 'Đã chốt xe' :
                               lead.status === 'negotiating' ? 'Đang đàm phán' :
                               lead.status === 'contacted' ? 'Đã liên hệ' : 'Mới'}
                            </span>
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {lead.model} • {lead.need} • SĐT: <a href={`tel:${lead.phone}`} className="text-vw-blue font-bold hover:underline">{lead.phone}</a>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {lead.createdAt}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Car Inventory Stats (4 cols) */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-extrabold text-vw-blue">
                    Dòng Xe Phân Phối ({cars.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('cars')}
                    className="text-xs font-bold text-vw-cyan hover:underline"
                  >
                    Quản lý &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {cars.slice(0, 5).map(car => (
                    <div key={car.id} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{car.name}</span>
                      <span className="font-black text-vw-red">{car.priceText.replace('Giá từ ', '')}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('cars')}
                  className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Quản Lý Bảng Giá & Chi Tiết Xe &rarr;
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB: LEADS MANAGEMENT */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-3 flex-grow">
                <div className="relative min-w-[240px] flex-grow max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, SĐT, dòng xe..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-vw-blue"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="new">Mới (Chưa liên hệ)</option>
                  <option value="contacted">Đã liên hệ</option>
                  <option value="negotiating">Đang đàm phán</option>
                  <option value="won">Đã chốt mua xe</option>
                  <option value="lost">Không mua / Hủy</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={() => setIsAddingLead(true)}
                  className="px-4 py-2 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Khách Mới</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  title="Xuất file Excel CSV"
                >
                  <Download className="w-4 h-4" />
                  <span>Xuất CSV</span>
                </button>
              </div>

            </div>

            {/* Modal: Add New Lead Manually */}
            {isAddingLead && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-extrabold text-vw-blue text-base">Thêm Khách Hàng Trực Tiếp</h4>
                    <button onClick={() => setIsAddingLead(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>
                  <form onSubmit={handleAddNewLead} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                      <input
                        type="text"
                        required
                        value={newLeadName}
                        onChange={(e) => setNewLeadName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                      <input
                        type="tel"
                        required
                        value={newLeadPhone}
                        onChange={(e) => setNewLeadPhone(e.target.value)}
                        placeholder="09xxxxxxxx"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={newLeadEmail}
                        onChange={(e) => setNewLeadEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Dòng xe quan tâm</label>
                        <select
                          value={newLeadModel}
                          onChange={(e) => setNewLeadModel(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                        >
                          {cars.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nhu cầu</label>
                        <select
                          value={newLeadNeed}
                          onChange={(e) => setNewLeadNeed(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                        >
                          <option value="Nhận báo giá">Nhận báo giá</option>
                          <option value="Đăng kí lái thử">Đăng ký lái thử</option>
                          <option value="Tư vấn trả góp">Tư vấn trả góp</option>
                          <option value="Khách xem xe tại showroom">Khách tại Showroom</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ghi chú</label>
                      <textarea
                        rows={2}
                        value={newLeadNote}
                        onChange={(e) => setNewLeadNote(e.target.value)}
                        placeholder="Nội dung trao đổi ban đầu..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingLead(false)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-vw-blue text-white font-bold"
                      >
                        Lưu Khách Hàng
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Leads Table Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Khách Hàng</th>
                      <th className="py-3.5 px-4">Liên Hệ</th>
                      <th className="py-3.5 px-4">Xe Quan Tâm & Nhu Cầu</th>
                      <th className="py-3.5 px-4">Trạng Thái Xử Lý</th>
                      <th className="py-3.5 px-4">Ghi Chú Tư Vấn</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Không tìm thấy khách hàng nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          
                          {/* Name & Time */}
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-vw-blue text-sm">
                              {lead.fullName}
                            </div>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {lead.createdAt}
                            </span>
                          </td>

                          {/* Contact Phone & Email */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-vw-red">
                              <Phone className="w-3.5 h-3.5" />
                              <a href={`tel:${lead.phone}`} className="hover:underline">
                                {lead.phone}
                              </a>
                            </div>
                            {lead.email && (
                              <div className="text-[11px] text-slate-500 truncate max-w-[150px] mt-0.5">
                                {lead.email}
                              </div>
                            )}
                          </td>

                          {/* Model & Need */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800">
                              {lead.model}
                            </div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px]">
                              {lead.need}
                            </span>
                            {lead.note && (
                              <p className="text-[11px] text-slate-500 italic mt-1 max-w-xs">
                                "{lead.note}"
                              </p>
                            )}
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3.5 px-4">
                            <select
                              value={lead.status || 'new'}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border focus:outline-none ${
                                lead.status === 'won' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                                lead.status === 'negotiating' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                                lead.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                lead.status === 'lost' ? 'bg-slate-100 text-slate-500 border-slate-300' :
                                'bg-red-50 text-vw-red border-red-300'
                              }`}
                            >
                              <option value="new">🔴 Mới nhận</option>
                              <option value="contacted">🔵 Đã liên hệ</option>
                              <option value="negotiating">🟡 Đang đàm phán</option>
                              <option value="won">🟢 Đã chốt mua xe</option>
                              <option value="lost">⚪ Hủy / Không mua</option>
                            </select>
                          </td>

                          {/* Sales Notes */}
                          <td className="py-3.5 px-4">
                            <input
                              type="text"
                              placeholder="Nhập ghi chú cuộc gọi..."
                              defaultValue={lead.salesNotes || ''}
                              onBlur={(e) => handleUpdateSalesNotes(lead.id, e.target.value)}
                              className="w-full max-w-[200px] px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-vw-blue"
                            />
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`tel:${lead.phone}`}
                                className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
                                title="Gọi điện"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                title="Xóa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB: CAR INVENTORY & FULL EDITING */}
        {activeTab === 'cars' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-vw-cyan" />
                  <h3 className="text-lg font-black text-vw-blue">
                    Quản Lý Dòng Xe & Bảng Giá ({cars.length} Mẫu Xe)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Chỉnh sửa tên xe, hình ảnh, phân khúc, nhãn nổi bật, giá niêm yết và thông số. Thay đổi sẽ lập tức hiển thị ra ngoài website!
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleResetDefaultCars}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Khôi phục lại dữ liệu ban đầu"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Khôi Phục Mặc Định</span>
                </button>

                <button
                  onClick={handleOpenAddCar}
                  className="px-4 py-2 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Dòng Xe Mới</span>
                </button>
              </div>
            </div>

            {/* Car Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-vw-cyan transition-all"
                >
                  <div>
                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                      <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {car.badge && (
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-vw-blue text-white text-[10px] font-black uppercase shadow">
                          {car.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">
                        {car.categoryLabel}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-extrabold text-vw-blue text-sm line-clamp-1">{car.name}</h4>
                      <div className="text-base font-black text-vw-red">{car.priceText}</div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{car.tagline}</p>

                      {/* Quick specs preview */}
                      <div className="pt-2 grid grid-cols-2 gap-1 text-[10px] text-slate-500 border-t border-slate-100">
                        <span>• {car.specs.seats} chỗ ngồi</span>
                        <span>• {car.specs.engine.split(' ')[0]}</span>
                        <span>• {car.specs.transmission.split(' ')[0]}</span>
                        <span>• {car.specs.drivetrain}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditCar(car)}
                      className="flex-1 py-2 bg-slate-50 hover:bg-vw-blue hover:text-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa Xe</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCar(car.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                      title="Xóa mẫu xe này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Edit or Add Full Car */}
            {(editingCar || isAddingCar) && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-vw-blue text-base">
                        {isAddingCar ? 'Thêm Dòng Xe Volkswagen Mới' : `Chỉnh Sửa Xe: ${editingCar?.name}`}
                      </h4>
                      <p className="text-xs text-slate-500">Mọi thay đổi sẽ ngay lập tức đồng bộ ra trang chủ</p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingCar(null);
                        setIsAddingCar(false);
                      }} 
                      className="text-slate-400 hover:text-slate-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveCarForm} className="space-y-4 text-xs">
                    
                    {/* Tên xe & Phân khúc */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tên dòng xe *</label>
                        <input
                          type="text"
                          required
                          value={editCarForm.name || ''}
                          onChange={(e) => setEditCarForm({ ...editCarForm, name: e.target.value })}
                          placeholder="Ví dụ: Volkswagen Viloran"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-vw-blue"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Phân khúc lọc (Category)</label>
                        <select
                          value={editCarForm.category || 'suv'}
                          onChange={(e) => {
                            const cat = e.target.value as 'suv' | 'mpv' | 'hatchback';
                            const label = cat === 'suv' ? 'SUV / Crossover' : cat === 'mpv' ? 'MPV Thương Gia' : 'Hatchback Thể Thao';
                            setEditCarForm({ ...editCarForm, category: cat, categoryLabel: label });
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                        >
                          <option value="suv">SUV / Crossover</option>
                          <option value="mpv">MPV Thương Gia</option>
                          <option value="hatchback">Hatchback Thể Thao</option>
                        </select>
                      </div>
                    </div>

                    <ImageUploadInput
                      label="Hình ảnh xe đại diện"
                      value={editCarForm.image || ''}
                      onChange={(img) => setEditCarForm({ ...editCarForm, image: img })}
                      required
                    />

                    {/* Nhãn nổi bật & Nhãn phân khúc */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nhãn trên ảnh (Badge)</label>
                        <input
                          type="text"
                          value={editCarForm.badge || ''}
                          onChange={(e) => setEditCarForm({ ...editCarForm, badge: e.target.value })}
                          placeholder="BÁN CHẠY NHẤT, MỚI RA MẮT, FLAGSHIP..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nhãn phân khúc góc phải</label>
                        <input
                          type="text"
                          value={editCarForm.categoryLabel || ''}
                          onChange={(e) => setEditCarForm({ ...editCarForm, categoryLabel: e.target.value })}
                          placeholder="MPV Thương Gia, SUV Thể Thao Coupe..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Giá niêm yết (Text) & Giá số nguyên (Number) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Giá hiển thị (Chuỗi text) *</label>
                        <input
                          type="text"
                          required
                          value={editCarForm.priceText || ''}
                          onChange={(e) => setEditCarForm({ ...editCarForm, priceText: e.target.value })}
                          placeholder="Giá từ 2 tỷ 088 triệu"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-vw-red"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Giá số nguyên tính lăn bánh (VNĐ) *</label>
                        <input
                          type="number"
                          required
                          value={editCarForm.priceNumber || 0}
                          onChange={(e) => setEditCarForm({ ...editCarForm, priceNumber: parseInt(e.target.value) || 0 })}
                          placeholder="2088000000"
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                        />
                      </div>
                    </div>

                    {/* Khẩu hiệu / Tagline */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Khẩu hiệu / Mô tả ngắn</label>
                      <input
                        type="text"
                        value={editCarForm.tagline || ''}
                        onChange={(e) => setEditCarForm({ ...editCarForm, tagline: e.target.value })}
                        placeholder="MPV hạng sang đích thực - Đỉnh cao phong thái doanh nhân"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                      />
                    </div>

                    {/* 4 Quick Specs */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        4 Thông số nhanh hiển thị trên thẻ xe
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 flex items-center gap-1">
                            <UsersIcon className="w-3 h-3 text-vw-cyan" /> Số chỗ
                          </span>
                          <input
                            type="number"
                            value={editCarForm.specs?.seats || 7}
                            onChange={(e) => setEditCarForm({
                              ...editCarForm,
                              specs: { ...editCarForm.specs!, seats: parseInt(e.target.value) || 5 }
                            })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-vw-cyan" /> Động cơ
                          </span>
                          <input
                            type="text"
                            value={editCarForm.specs?.engine || '2.0L TSI'}
                            onChange={(e) => setEditCarForm({
                              ...editCarForm,
                              specs: { ...editCarForm.specs!, engine: e.target.value }
                            })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 flex items-center gap-1">
                            <Cog className="w-3 h-3 text-vw-cyan" /> Hộp số
                          </span>
                          <input
                            type="text"
                            value={editCarForm.specs?.transmission || '7 cấp DSG'}
                            onChange={(e) => setEditCarForm({
                              ...editCarForm,
                              specs: { ...editCarForm.specs!, transmission: e.target.value }
                            })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block mb-1 flex items-center gap-1">
                            <Compass className="w-3 h-3 text-vw-cyan" /> Dẫn động
                          </span>
                          <input
                            type="text"
                            value={editCarForm.specs?.drivetrain || '4MOTION'}
                            onChange={(e) => setEditCarForm({
                              ...editCarForm,
                              specs: { ...editCarForm.specs!, drivetrain: e.target.value }
                            })}
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCar(null);
                          setIsAddingCar(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-vw-blue text-white font-bold shadow"
                      >
                        {isAddingCar ? 'Thêm Xe Mới' : 'Lưu Thay Đổi Xe'}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: SHOWROOM SETTINGS & MESSENGER (HÌNH 1) */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            <div>
              <h3 className="text-lg font-black text-vw-blue">
                Cài Đặt Showroom, Hotline, Zalo & Messenger
              </h3>
              <p className="text-xs text-slate-500">
                Toàn bộ thông tin tại đây sẽ ngay lập tức đồng bộ đến Header, Footer, Thanh liên hệ nổi góc phải (Messenger, Zalo, Hotline) và Mobile.
              </p>
            </div>

            {settingsSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã lưu thông tin cài đặt showroom & các kênh liên hệ thành công!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Showroom / Đại lý *</label>
                <input
                  type="text"
                  required
                  value={tempSettings.name}
                  onChange={(e) => setTempSettings({ ...tempSettings, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Công Ty Pháp Lý *</label>
                <input
                  type="text"
                  required
                  value={tempSettings.company}
                  onChange={(e) => setTempSettings({ ...tempSettings, company: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa Chỉ Showroom *</label>
                <input
                  type="text"
                  required
                  value={tempSettings.address}
                  onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Hotline (tel:) *</label>
                  <input
                    type="text"
                    required
                    value={tempSettings.hotline}
                    onChange={(e) => setTempSettings({ ...tempSettings, hotline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-vw-red"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hotline Hiển Thị (Có dấu chấm) *</label>
                  <input
                    type="text"
                    required
                    value={tempSettings.hotlineFormatted}
                    onChange={(e) => setTempSettings({ ...tempSettings, hotlineFormatted: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Ô LIÊN HỆ MESSENGER & ZALO (ĐÁP ỨNG CHÍNH XÁC HÌNH 1) */}
              <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-3">
                <div className="flex items-center gap-2 text-sky-800 font-extrabold text-xs">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <span>Kênh Nhắn Tin Trực Tuyến (Messenger & Zalo)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Đường dẫn Facebook Messenger (URL Chat) *
                    </label>
                    <input
                      type="url"
                      required
                      value={tempSettings.messenger || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, messenger: e.target.value })}
                      placeholder="https://m.me/your_fanpage_id"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-[11px] text-sky-700"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Ví dụ: <code>https://m.me/649644434900717</code> hoặc <code>https://m.me/tenfanpage</code>
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số Điện Thoại Zalo Tư Vấn *</label>
                    <input
                      type="text"
                      required
                      value={tempSettings.zaloPhone}
                      onChange={(e) => setTempSettings({ 
                        ...tempSettings, 
                        zaloPhone: e.target.value,
                        zalo: `https://zalo.me/${e.target.value.replace(/\s+/g, '')}`
                      })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-blue-700"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Tự động tạo link: <code>https://zalo.me/{tempSettings.zaloPhone?.replace(/\s+/g, '')}</code>
                    </span>
                  </div>
                </div>
              </div>

              {/* Các kênh Mạng Xã Hội */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-extrabold text-xs">
                  <Share2 className="w-4 h-4 text-vw-cyan" />
                  <span>Các Kênh Mạng Xã Hội Khác</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Fanpage Facebook</label>
                    <input
                      type="url"
                      value={tempSettings.facebook || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Kênh YouTube</label>
                    <input
                      type="url"
                      value={tempSettings.youtube || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, youtube: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Kênh TikTok</label>
                    <input
                      type="url"
                      value={tempSettings.tiktok || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, tiktok: e.target.value })}
                      placeholder="https://tiktok.com/@..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Showroom</label>
                  <input
                    type="email"
                    value={tempSettings.email}
                    onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thời Gian Hoạt Động</label>
                  <input
                    type="text"
                    value={tempSettings.openHours}
                    onChange={(e) => setTempSettings({ ...tempSettings, openHours: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* CẤU HÌNH THÔNG BÁO EMAIL KHI CÓ KHÁCH ĐĂNG KÝ (USER YÊU CẦU) */}
              <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/70 pb-3">
                  <div className="flex items-center gap-2.5 text-emerald-900 font-extrabold text-sm">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block">Thông Báo Email Khi Có Khách Đăng Ký Mới</span>
                      <span className="text-[11px] text-emerald-700 font-normal">
                        Tự động gửi email kèm toàn bộ thông tin khách (Họ tên, SĐT, dòng xe, nhu cầu, thời gian) về email cá nhân
                      </span>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempSettings.notificationEnabled !== false}
                      onChange={(e) => setTempSettings({ ...tempSettings, notificationEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Email Cá Nhân Nhận Thông Báo (Gmail, Outlook, Yahoo...) *
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="email"
                        required={tempSettings.notificationEnabled !== false}
                        value={tempSettings.notificationEmail || tempSettings.email || ''}
                        onChange={(e) => setTempSettings({ ...tempSettings, notificationEmail: e.target.value })}
                        placeholder="vi-du: admin.sales@gmail.com"
                        className="flex-1 px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />

                      <button
                        type="button"
                        disabled={isSendingTestEmail}
                        onClick={handleTestEmail}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                        title="Bấm để gửi 1 email mẫu thử nghiệm tới địa chỉ email trên"
                      >
                        <Send className={`w-3.5 h-3.5 ${isSendingTestEmail ? 'animate-pulse' : ''}`} />
                        <span>{isSendingTestEmail ? 'Đang gửi mail thử...' : 'Gửi Thử 1 Email Kiểm Tra'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-800">
                        Web3Forms Access Key <span className="text-emerald-600 text-[11px] font-semibold">(Khuyên dùng - Miễn phí & Cực kỳ ổn định)</span>
                      </label>
                      <a 
                        href="https://web3forms.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>👉 Lấy Key miễn phí tại web3forms.com</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <input
                      type="text"
                      value={tempSettings.web3FormsAccessKey || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, web3FormsAccessKey: e.target.value })}
                      placeholder="Dán mã Access Key vào đây (ví dụ: a1b2c3d4-e5f6-7890-abcd-ef1234567890)"
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      💡 <strong>Cách lấy key trong 10 giây:</strong> Vào <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">web3forms.com</a>, nhập email của bạn và bấm <em>"Create Access Key"</em>. Mở Gmail copy mã dán vào ô trên là xong.
                    </p>
                  </div>

                  {testEmailMsg && (
                    <div className={`p-3 rounded-xl text-xs font-semibold border ${
                      testEmailMsg.success
                        ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {testEmailMsg.text}
                    </div>
                  )}

                  <div className="bg-white/90 p-3.5 rounded-xl border border-emerald-100 text-[11px] text-slate-600 space-y-1.5">
                    <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>💡 Cơ chế hoạt động gửi Email:</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>Bất cứ khi nào khách bấm <strong>"Gửi Đăng Ký"</strong> hoặc <strong>"Nhận Báo Giá"</strong> ngoài website, hệ thống sẽ tự động gửi email thông báo ngay lập tức.</li>
                      <li><strong>Nếu có Web3Forms Access Key:</strong> Email được gửi qua cổng Web3Forms API chính thức, tốc độ cực nhanh, không lo bị chặn bởi AdBlock hay lỗi máy chủ.</li>
                      <li><strong>Nếu không điền Access Key:</strong> Hệ thống sẽ tự động gửi qua FormSubmit.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-vw-blue hover:bg-vw-blue-light text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Toàn Bộ Cài Đặt Liên Hệ & Email</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>

      {/* Modal: Cấu Hình Supabase Cloud Database */}
      {isDbModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-vw-blue flex items-center gap-2">
                    <span>Kết Nối Cloud Database (Supabase)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      isSupabaseConfigured() ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {isSupabaseConfigured() ? 'Đang Hoạt Động' : 'Chưa Kết Nối'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lưu trữ dữ liệu khách hàng & nội dung website trên đám mây PostgreSQL miễn phí trọn đời
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsDbModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Lợi ích nổi bật */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
              <span className="font-extrabold text-vw-blue block text-sm">✨ Lợi ích khi dùng Cloud Database Supabase:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>Truy cập mọi nơi:</strong> Mở trang Admin từ điện thoại, máy tính ở nhà hay quán cafe đều xem được khách hàng mới.</li>
                <li><strong>Đồng bộ thời gian thực (Realtime):</strong> Khi có khách đăng ký ngoài web, màn hình Admin của tất cả nhân viên tự động nhảy số ngay mà không cần F5.</li>
                <li><strong>Không lo mất dữ liệu:</strong> Dữ liệu được bảo toàn vĩnh viễn trên máy chủ bảo mật của Supabase.</li>
              </ul>
            </div>

            {/* 3 Bước thực hiện */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs text-vw-blue uppercase tracking-wider">3 Bước Cài Đặt (Miễn Phí 100%):</h4>
              
              <div className="grid grid-cols-1 gap-3 text-xs">
                
                {/* Bước 1 */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vw-blue text-white flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800">Đăng ký tài khoản Supabase (Miễn phí)</span>
                    <p className="text-slate-500 text-[11px]">Vào trang <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-vw-cyan font-bold underline inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a>, tạo một Project mới (chọn Region Singapore để tốc độ tại VN nhanh nhất).</p>
                  </div>
                </div>

                {/* Bước 2 */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vw-blue text-white flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                  <div className="space-y-2 flex-grow">
                    <span className="font-bold text-slate-800">Tạo các bảng cơ sở dữ liệu trên Supabase</span>
                    <p className="text-slate-500 text-[11px]">Trong dashboard Supabase, vào mục <strong>SQL Editor</strong>, dán mã SQL tạo bảng và bấm <strong>Run</strong>.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const sqlText = `-- Xem file supabase_schema.sql trong thư mục gốc của project!`;
                        navigator.clipboard.writeText(sqlText);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 2500);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-vw-blue font-bold text-[11px] hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Mã SQL đã có sẵn trong file <code>supabase_schema.sql</code> ở thư mục dự án</span>
                    </button>
                  </div>
                </div>

                {/* Bước 3 */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vw-blue text-white flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800">Lấy API Keys dán vào 2 ô bên dưới</span>
                    <p className="text-slate-500 text-[11px]">Vào mục <strong>Project Settings &rarr; API</strong> trên Supabase, copy <code>Project URL</code> và <code>anon public key</code>.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Form nhập cấu hình */}
            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 pt-2 border-t border-slate-100">
              
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Supabase Project URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://xyzabcdefghijklmnop.supabase.co"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Supabase Anon Public Key *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              {/* Nút kiểm tra kết nối */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={testStatus === 'testing'}
                  onClick={handleTestConnection}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                  <span>{testStatus === 'testing' ? 'Đang kiểm tra...' : 'Kiểm Tra Kết Nối Thử'}</span>
                </button>
                <span className="text-[11px] text-slate-400">
                  (Bấm để kiểm tra xem URL, Anon Key và các bảng dữ liệu đã sẵn sàng chưa)
                </span>
              </div>

              {testMessage && (
                <div className={`p-3 rounded-xl text-xs font-semibold border leading-relaxed ${
                  testStatus === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold' 
                    : testStatus === 'testing'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  {testMessage}
                </div>
              )}

              {dbSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Đã lưu cấu hình Supabase! Đang tải lại trang để kích hoạt Cloud Database...</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                {isSupabaseConfigured() ? (
                  <button
                    type="button"
                    onClick={handleDisconnectSupabase}
                    className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                  >
                    Ngắt kết nối Supabase
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDbModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Đóng
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-2"
                  >
                    <Cloud className="w-4 h-4" />
                    <span>Lưu & Kích Hoạt Cloud Database</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
