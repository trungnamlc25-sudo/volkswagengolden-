import { getSupabase } from '../lib/supabase';
import type { Lead, CarModel, ShowroomSettings, SiteContent, LeadStatus } from '../types/car';
import { CARS_DATA, DEFAULT_SITE_CONTENT, SHOWROOM_INFO } from '../data/carsData';
import { sendLeadNotificationEmail } from './emailNotificationService';

// -------------------------------------------------------------
// LEADS SERVICE
// -------------------------------------------------------------
export const fetchLeads = async (): Promise<Lead[]> => {
  // 1. Try local server API (/api/leads)
  try {
    const res = await fetch('/api/leads');
    if (res.ok) {
      const serverLeads = await res.json();
      if (Array.isArray(serverLeads) && serverLeads.length > 0) {
        return serverLeads;
      }
    }
  } catch {
    // Continue to fallback
  }

  // 2. Try Supabase
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          fullName: row.full_name,
          phone: row.phone,
          email: row.email,
          model: row.model,
          need: row.need,
          note: row.note,
          salesNotes: row.sales_notes,
          status: row.status as LeadStatus,
          createdAt: new Date(row.created_at).toLocaleString('vi-VN')
        }));
      }
    } catch (err) {
      console.warn('Supabase fetchLeads error, falling back to localStorage:', err);
    }
  }

  // 3. Fallback to localStorage
  try {
    const saved = localStorage.getItem('vw_golden_leads');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const saveNewLead = async (lead: Lead, currentSettings?: ShowroomSettings): Promise<boolean> => {
  // 1. Always update localStorage first for instant UI response
  try {
    const local = localStorage.getItem('vw_golden_leads');
    const leadsList: Lead[] = local ? JSON.parse(local) : [];
    const filtered = leadsList.filter(l => l.id !== lead.id);
    localStorage.setItem('vw_golden_leads', JSON.stringify([lead, ...filtered]));
  } catch (e) {
    console.error(e);
  }

  // 2. Persist to server disk API (/api/leads)
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
  } catch (err) {
    console.warn('Không thể lưu lead lên /api/leads:', err);
  }

  // 3. Gửi thông báo về email cá nhân
  try {
    let recipient = (currentSettings?.notificationEmail || '').trim();
    let isEnabled = currentSettings?.notificationEnabled !== false;

    // Fallback 1: LocalStorage settings
    if (!recipient) {
      const rawSettings = localStorage.getItem('vw_golden_showroom_settings');
      if (rawSettings) {
        try {
          const parsed = JSON.parse(rawSettings);
          recipient = (parsed.notificationEmail || parsed.email || '').trim();
          if (parsed.notificationEnabled !== undefined) {
            isEnabled = parsed.notificationEnabled;
          }
        } catch {}
      }
    }

    // Fallback 2: Server API settings (/api/settings)
    if (!recipient) {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const serverSettings = await res.json();
          recipient = (serverSettings?.notificationEmail || serverSettings?.email || '').trim();
          if (serverSettings?.notificationEnabled !== undefined) {
            isEnabled = serverSettings.notificationEnabled;
          }
        }
      } catch {}
    }

    // Fallback 3: Default SHOWROOM_INFO
    if (!recipient) {
      recipient = (SHOWROOM_INFO.notificationEmail || '').trim();
    }

    if (isEnabled && recipient && recipient.includes('@')) {
      console.log(`[Email Notification] Đang gửi thông báo lead tới email: ${recipient}`);
      const result = await sendLeadNotificationEmail(lead, recipient);
      console.log('[Email Notification] Kết quả:', result);
    } else {
      console.warn('[Email Notification] Bỏ qua gửi email - chưa cấu hình email hoặc tính năng đang tắt:', {
        isEnabled,
        recipient
      });
    }
  } catch (err) {
    console.warn('Lỗi khi kích hoạt gửi email thông báo:', err);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('leads').insert([
        {
          id: lead.id,
          full_name: lead.fullName,
          phone: lead.phone,
          email: lead.email || null,
          model: lead.model,
          need: lead.need,
          note: lead.note || null,
          sales_notes: lead.salesNotes || null,
          status: lead.status || 'new',
          created_at: new Date().toISOString()
        }
      ]);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase saveNewLead error:', err);
    }
  }

  return true;
};

export const updateLeadStatusInDb = async (leadId: string, newStatus: LeadStatus): Promise<void> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    } catch (err) {
      console.warn('Supabase updateLeadStatus error:', err);
    }
  }
};

export const updateLeadSalesNotesInDb = async (leadId: string, notes: string): Promise<void> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('leads').update({ sales_notes: notes }).eq('id', leadId);
    } catch (err) {
      console.warn('Supabase updateLeadSalesNotes error:', err);
    }
  }
};

export const deleteLeadFromDb = async (leadId: string): Promise<void> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('leads').delete().eq('id', leadId);
    } catch (err) {
      console.warn('Supabase deleteLead error:', err);
    }
  }
};

// Realtime subscriber for leads
export const subscribeToLeads = (onNewLead: (lead: Lead) => void) => {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('realtime:leads')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'leads' },
      (payload) => {
        const row = payload.new;
        const newLead: Lead = {
          id: row.id,
          fullName: row.full_name,
          phone: row.phone,
          email: row.email,
          model: row.model,
          need: row.need,
          note: row.note,
          salesNotes: row.sales_notes,
          status: row.status as LeadStatus,
          createdAt: new Date(row.created_at).toLocaleString('vi-VN')
        };
        onNewLead(newLead);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// -------------------------------------------------------------
// SITE CONTENT (CMS) SERVICE
// -------------------------------------------------------------
export const fetchSiteContent = async (): Promise<SiteContent> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'current')
        .single();

      if (!error && data?.content) {
        return {
          ...DEFAULT_SITE_CONTENT,
          ...data.content
        };
      }
    } catch (err) {
      console.warn('Supabase fetchSiteContent error, falling back to localStorage:', err);
    }
  }

  // Fallback to localStorage
  try {
    const saved = localStorage.getItem('vw_golden_site_content');
    if (saved) {
      return {
        ...DEFAULT_SITE_CONTENT,
        ...JSON.parse(saved)
      };
    }
  } catch (e) {
    console.error(e);
  }

  return DEFAULT_SITE_CONTENT;
};

export const saveSiteContentToDb = async (content: SiteContent): Promise<void> => {
  localStorage.setItem('vw_golden_site_content', JSON.stringify(content));

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('site_content').upsert({
        id: 'current',
        content,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase saveSiteContent error:', err);
    }
  }
};

// -------------------------------------------------------------
// SHOWROOM SETTINGS SERVICE
// -------------------------------------------------------------
export const fetchShowroomSettings = async (): Promise<ShowroomSettings> => {
  // 1. Try local server API (/api/settings)
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) {
        localStorage.setItem('vw_golden_showroom_settings', JSON.stringify(data));
        return data;
      }
    }
  } catch {
    // Continue
  }

  // 2. Try Supabase
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('showroom_settings')
        .select('*')
        .eq('id', 'current')
        .single();

      if (!error && data) {
        return {
          name: data.name,
          company: data.company,
          address: data.address,
          hotline: data.hotline,
          hotlineFormatted: data.hotline_formatted,
          email: data.email,
          zaloPhone: data.zalo_phone,
          zalo: data.zalo,
          messenger: data.messenger,
          openHours: data.open_hours,
          facebook: data.facebook,
          youtube: data.youtube,
          tiktok: data.tiktok,
          notificationEmail: data.notification_email || data.email,
          notificationEnabled: data.notification_enabled !== false
        };
      }
    } catch (err) {
      console.warn('Supabase fetchShowroomSettings error, falling back to localStorage:', err);
    }
  }

  // 3. Fallback to localStorage
  try {
    const saved = localStorage.getItem('vw_golden_showroom_settings');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }

  return SHOWROOM_INFO;
};

export const saveShowroomSettingsToDb = async (settings: ShowroomSettings): Promise<void> => {
  // 1. LocalStorage
  localStorage.setItem('vw_golden_showroom_settings', JSON.stringify(settings));

  // 2. Local server API (/api/settings) to share across LAN
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
  } catch (err) {
    console.warn('Không thể lưu settings lên /api/settings:', err);
  }

  // 3. Supabase
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('showroom_settings').upsert({
        id: 'current',
        name: settings.name,
        company: settings.company,
        address: settings.address,
        hotline: settings.hotline,
        hotline_formatted: settings.hotlineFormatted,
        email: settings.email,
        zalo_phone: settings.zaloPhone,
        zalo: settings.zalo,
        messenger: settings.messenger,
        open_hours: settings.openHours,
        facebook: settings.facebook || null,
        youtube: settings.youtube || null,
        tiktok: settings.tiktok || null,
        notification_email: settings.notificationEmail || null,
        notification_enabled: settings.notificationEnabled !== false,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase saveShowroomSettings error:', err);
    }
  }
};

// -------------------------------------------------------------
// CARS INVENTORY SERVICE
// -------------------------------------------------------------
export const fetchCars = async (): Promise<CarModel[]> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('price_number', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          tagline: c.tagline,
          category: c.category,
          categoryLabel: c.category_label,
          priceText: c.price_text,
          priceNumber: Number(c.price_number),
          image: c.image,
          gallery: c.gallery || [],
          badge: c.badge,
          highlights: c.highlights || [],
          specs: c.specs,
          features: c.features || [],
          colors: c.colors || []
        }));
      }
    } catch (err) {
      console.warn('Supabase fetchCars error, falling back to localStorage:', err);
    }
  }

  // Fallback to localStorage or CARS_DATA
  try {
    const saved = localStorage.getItem('vw_golden_cars_custom');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }

  return CARS_DATA;
};

export const saveCarsToDb = async (carsList: CarModel[]): Promise<void> => {
  localStorage.setItem('vw_golden_cars_custom', JSON.stringify(carsList));

  const supabase = getSupabase();
  if (supabase) {
    try {
      for (const car of carsList) {
        await supabase.from('cars').upsert({
          id: car.id,
          name: car.name,
          slug: car.slug,
          tagline: car.tagline,
          category: car.category,
          category_label: car.categoryLabel,
          price_text: car.priceText,
          price_number: car.priceNumber,
          image: car.image,
          gallery: car.gallery,
          badge: car.badge || null,
          highlights: car.highlights,
          specs: car.specs,
          features: car.features,
          colors: car.colors
        });
      }
    } catch (err) {
      console.warn('Supabase saveCars error:', err);
    }
  }
};
