import type { Lead } from '../types/car';

export interface EmailSendResult {
  success: boolean;
  message: string;
}

/**
 * Gửi thông báo có khách hàng mới đăng ký tới email cá nhân của quản trị viên / nhân viên tư vấn.
 * Hỗ trợ Web3Forms (khuyên dùng, độ tin cậy cao) hoặc FormSubmit.
 */
export const sendLeadNotificationEmail = async (
  lead: Lead,
  recipientEmail: string,
  web3FormsKey?: string
): Promise<EmailSendResult> => {
  if (!recipientEmail || !recipientEmail.trim() || !recipientEmail.includes('@')) {
    return {
      success: false,
      message: 'Địa chỉ email nhận thông báo không hợp lệ.'
    };
  }

  const cleanEmail = recipientEmail.trim().toLowerCase();
  const trimmedKey = (web3FormsKey || '').trim();

  // 1. ƯU TIÊN SỬ DỤNG WEB3FORMS (NẾU CÓ ACCESS KEY)
  if (trimmedKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: trimmedKey,
          subject: `🚗 [KHÁCH HÀNG MỚI] ${lead.fullName} - ${lead.phone} (${lead.model})`,
          from_name: 'Volkswagen Showroom Lead Alert',
          to_email: cleanEmail,
          'Họ và tên khách': lead.fullName,
          'Số điện thoại': lead.phone,
          'Email khách': lead.email || 'Không nhập email',
          'Dòng xe quan tâm': lead.model,
          'Nhu cầu': lead.need,
          'Ghi chú': lead.note || 'Không có ghi chú thêm',
          'Thời gian đăng ký': lead.createdAt || new Date().toLocaleString('vi-VN'),
          'Nguồn': 'Website Volkswagen Golden (Form Đăng Ký Trực Tuyến)'
        })
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && (data.success === true || data.success === 'true')) {
        console.log('✅ Gửi email qua Web3Forms thành công:', data);
        return {
          success: true,
          message: `Đã gửi thông báo thành công tới email ${cleanEmail} (qua Web3Forms)!`
        };
      } else {
        console.warn('⚠️ Web3Forms trả về lỗi:', data);
        return {
          success: false,
          message: data.message || `Lỗi Web3Forms (Mã HTTP: ${response.status})`
        };
      }
    } catch (err: any) {
      console.warn('⚠️ Lỗi kết nối Web3Forms:', err);
      // Tiếp tục fallback sang FormSubmit nếu Web3Forms lỗi kết nối
    }
  }

  // 2. FALLBACK SANG FORMSUBMIT
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
        return {
          success: false,
          message: data.message || 'FormSubmit yêu cầu bấm Xác Nhận (Activate) trong email trước.'
        };
      }
      return {
        success: true,
        message: data.message || `Đã gửi thông báo thành công tới email ${cleanEmail}!`
      };
    } else {
      return {
        success: false,
        message: `Máy chủ FormSubmit phản hồi mã lỗi ${response.status}. Hãy nhập Web3Forms Access Key để gửi ổn định.`
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Lỗi kết nối cổng FormSubmit: ${error.message || 'Server FormSubmit đang bảo trì'}. Vui lòng nhập Web3Forms Access Key để gửi thư ổn định.`
    };
  }
};

/**
 * Gửi email kiểm tra thử nghiệm (Test Email) từ trang Admin
 */
export const sendTestNotificationEmail = async (
  recipientEmail: string,
  showroomName: string = 'Volkswagen Golden',
  web3FormsKey?: string
): Promise<EmailSendResult> => {
  if (!recipientEmail || !recipientEmail.trim() || !recipientEmail.includes('@')) {
    return {
      success: false,
      message: 'Vui lòng nhập địa chỉ email hợp lệ trước khi gửi thử!'
    };
  }

  const cleanEmail = recipientEmail.trim().toLowerCase();
  const trimmedKey = (web3FormsKey || '').trim();

  // 1. GỬI THỬ BẰNG WEB3FORMS (NẾU CÓ KEY)
  if (trimmedKey) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: trimmedKey,
          subject: `🧪 [TEST THÔNG BÁO] Kiểm tra kết nối Email từ ${showroomName}`,
          from_name: `${showroomName} (Test Alert)`,
          to_email: cleanEmail,
          'TRẠNG THÁI': '✅ KẾT NỐI THÀNH CÔNG! Hệ thống Web3Forms đã sẵn sàng nhận thông báo khi có khách đăng ký.',
          'HỌ VÀ TÊN KHÁCH (MẪU)': 'Nguyễn Văn Kiểm Tra',
          'SỐ ĐIỆN THOẠI (MẪU)': '0987654321',
          'EMAIL KHÁCH': 'khachhang.test@gmail.com',
          'DÒNG XE QUAN TÂM': 'Volkswagen Viloran (Luxury)',
          'NHU CẦU': 'Đăng ký lái thử & Nhận báo giá',
          'THỜI GIAN THỬ NGHIỆM': new Date().toLocaleString('vi-VN'),
          'HỆ THỐNG GỬI': 'Web3Forms API Gateway (Tốc độ cao & Ổn định)'
        })
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && (data.success === true || data.success === 'true')) {
        return {
          success: true,
          message: `✅ Tuyệt vời! Đã gửi email thử nghiệm thành công tới ${cleanEmail} qua Web3Forms! Vui lòng kiểm tra hộp thư đến (Inbox) của bạn.`
        };
      } else {
        return {
          success: false,
          message: `Lỗi Web3Forms: ${data.message || 'Access Key không hợp lệ hoặc đã hết hạn.'}`
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `Lỗi kết nối tới máy chủ Web3Forms: ${err.message || 'Vui lòng kiểm tra đường truyền mạng'}`
      };
    }
  }

  // 2. GỬI THỬ QUA FORMSUBMIT
  const payload = {
    _subject: `🧪 [TEST THÔNG BÁO] Kiểm tra kết nối Email từ ${showroomName}`,
    _template: 'table',
    _captcha: 'false',
    'TRẠNG THÁI': '✅ KẾT NỐI THÀNH CÔNG! Hệ thống đã sẵn sàng nhận thông báo khi có khách đăng ký.',
    'HỌ VÀ TÊN KHÁCH HÀNG (MẪU)': 'Nguyễn Văn Kiểm Tra (Khách Mẫu)',
    'SỐ ĐIỆN THOẠI': '0987654321',
    'EMAIL KHÁCH HÀNG': 'khachhang.test@gmail.com',
    'DÒNG XE QUAN TÂM': 'Volkswagen Viloran (Luxury)',
    'NHU CẦU': 'Đăng ký lái thử & Báo giá lăn bánh',
    'GHI CHÚ': 'Đây là email kiểm tra hệ thống thông báo tự động từ Admin Showroom.',
    'THỜI GIAN KIỂM TRA': new Date().toLocaleString('vi-VN'),
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
        message: `Không gửi được mail qua FormSubmit (Mã: ${response.status}). Khuyên dùng Web3Forms Access Key để gửi nhanh và ổn định.`
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Máy chủ FormSubmit đang lỗi kết nối (${error.message || '521'}). Hãy nhập Web3Forms Access Key ở ô bên dưới để chuyển sang dịch vụ gửi thư ổn định.`
    };
  }
};
