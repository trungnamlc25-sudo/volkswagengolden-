import type { Lead } from '../types/car';

export interface EmailSendResult {
  success: boolean;
  message: string;
}

/**
 * Gửi thông báo có khách hàng mới đăng ký tới email cá nhân của quản trị viên / nhân viên tư vấn.
 * Sử dụng FormSubmit AJAX Gateway bảo mật, hoạt động trực tiếp không cần cấu hình server SMTP phức tạp.
 */
export const sendLeadNotificationEmail = async (
  lead: Lead,
  recipientEmail: string
): Promise<EmailSendResult> => {
  if (!recipientEmail || !recipientEmail.trim() || !recipientEmail.includes('@')) {
    return {
      success: false,
      message: 'Địa chỉ email nhận thông báo không hợp lệ.'
    };
  }

  const cleanEmail = recipientEmail.trim().toLowerCase();

  const payload = {
    _subject: `🚗 [VOLKSWAGEN LEAD] ${lead.fullName} - ${lead.phone} (${lead.model})`,
    _template: 'table',
    _captcha: 'false',
    'HỌ VÀ TÊN KHÁCH HÀNG': lead.fullName,
    'SỐ ĐIỆN THOẠI': lead.phone,
    'EMAIL KHÁCH HÀNG': lead.email || 'Khách không nhập email',
    'DÒNG XE QUAN TÂM': lead.model,
    'NHU CẦU TƯ VẤN': lead.need,
    'GHI CHÚ KHÁCH HÀNG': lead.note || 'Không có ghi chú thêm',
    'THỜI GIAN ĐĂNG KÝ': lead.createdAt || new Date().toLocaleString('vi-VN'),
    'NGUỒN': 'Website Volkswagen Golden Urban Store (Form Đăng Ký)'
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      if (data.success === 'false' || data.success === false) {
        console.warn('⚠️ FormSubmit cảnh báo (chưa kích hoạt hoặc lỗi):', data);
        return {
          success: false,
          message: data.message || 'FormSubmit yêu cầu bấm Xác Nhận (Activate) trong email trước.'
        };
      }
      console.log('✅ Gửi email thông báo khách hàng thành công:', data);
      return {
        success: true,
        message: data.message || `Đã gửi thông báo thành công tới email ${cleanEmail}!`
      };
    } else {
      console.error('❌ Máy chủ gửi mail phản hồi mã lỗi:', response.status);
      return {
        success: false,
        message: `Máy chủ gửi mail phản hồi mã lỗi ${response.status}.`
      };
    }
  } catch (error: any) {
    console.warn('Lỗi khi gửi email thông báo khách hàng:', error);
    return {
      success: false,
      message: `Không thể gửi email: ${error.message || 'Lỗi kết nối mạng'}`
    };
  }
};

/**
 * Gửi email kiểm tra thử nghiệm (Test Email) từ trang Admin
 */
export const sendTestNotificationEmail = async (
  recipientEmail: string,
  showroomName: string = 'Volkswagen Golden'
): Promise<EmailSendResult> => {
  if (!recipientEmail || !recipientEmail.trim() || !recipientEmail.includes('@')) {
    return {
      success: false,
      message: 'Vui lòng nhập địa chỉ email hợp lệ trước khi gửi thử!'
    };
  }

  const cleanEmail = recipientEmail.trim().toLowerCase();

  const testLead: Lead = {
    id: 'test-' + Date.now(),
    fullName: 'Nguyễn Văn Kiểm Tra (Khách Mẫu)',
    phone: '0987654321',
    email: 'khachhang.test@gmail.com',
    model: 'Volkswagen Viloran (Luxury)',
    need: 'Đăng ký lái thử & Báo giá lăn bánh',
    note: 'Đây là email kiểm tra hệ thống thông báo tự động từ Admin Showroom.',
    createdAt: new Date().toLocaleString('vi-VN'),
    status: 'new'
  };

  const payload = {
    _subject: `🧪 [TEST THÔNG BÁO] Kiểm tra kết nối Email từ ${showroomName}`,
    _template: 'table',
    _captcha: 'false',
    'TRẠNG THÁI': '✅ KẾT NỐI THÀNH CÔNG! Hệ thống đã sẵn sàng nhận thông báo khi có khách đăng ký.',
    'HỌ VÀ TÊN KHÁCH HÀNG (MẪU)': testLead.fullName,
    'SỐ ĐIỆN THOẠI': testLead.phone,
    'EMAIL KHÁCH HÀNG': testLead.email,
    'DÒNG XE QUAN TÂM': testLead.model,
    'NHU CẦU': testLead.need,
    'GHI CHÚ': testLead.note,
    'THỜI GIAN KIỂM TRA': testLead.createdAt,
    'LƯU Ý': 'Nếu đây là lần đầu tiên sử dụng FormSubmit, vui lòng kiểm tra hộp thư đến (hoặc Thư rác/Spam) để bấm Xác Nhận (Activate) 1 lần duy nhất.'
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return {
        success: true,
        message: `Đã gửi email thử nghiệm tới ${cleanEmail}! Vui lòng kiểm tra hộp thư đến (inbox) của bạn.`
      };
    } else {
      return {
        success: false,
        message: `Không gửi được mail (Mã phản hồi: ${response.status}).`
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Lỗi kết nối: ${error.message || 'Không thể gửi email kiểm tra'}`
    };
  }
};
