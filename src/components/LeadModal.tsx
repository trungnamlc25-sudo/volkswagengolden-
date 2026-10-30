import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Phone, Sparkles, Send } from 'lucide-react';
import { CARS_DATA, SHOWROOM_INFO } from '../data/carsData';
import type { Lead, ShowroomSettings } from '../types/car';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedModel?: string;
  preselectedNeed?: string;
  initialNote?: string;
  onLeadSubmitted?: (lead: Lead) => Promise<any> | void;
  settings?: ShowroomSettings;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  preselectedModel = '',
  preselectedNeed = 'Nhận báo giá',
  initialNote = '',
  onLeadSubmitted,
  settings
}) => {
  const info = settings || SHOWROOM_INFO;
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [model, setModel] = useState(preselectedModel || '');
  const [need, setNeed] = useState(preselectedNeed || 'Nhận báo giá');
  const [note, setNote] = useState(initialNote || '');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedModel) setModel(preselectedModel);
    if (preselectedNeed) setNeed(preselectedNeed);
    if (initialNote) setNote(initialNote);
  }, [preselectedModel, preselectedNeed, initialNote]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Phone validation for Vietnam: 10 digits starting with 0
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      setErrorMsg('Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số bắt đầu bằng số 0.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và Tên của bạn.');
      return;
    }

    setIsSubmitting(true);

    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      model: model || 'Chưa chọn dòng xe',
      need: need || 'Nhận báo giá',
      note: note.trim() || undefined,
      createdAt: new Date().toLocaleString('vi-VN')
    };

    // Save lead to localStorage
    try {
      const existing = localStorage.getItem('vw_golden_leads');
      const leads: Lead[] = existing ? JSON.parse(existing) : [];
      leads.unshift(newLead);
      localStorage.setItem('vw_golden_leads', JSON.stringify(leads));
    } catch (err) {
      console.error('Error saving lead to storage:', err);
    }

    if (onLeadSubmitted) {
      try {
        await onLeadSubmitted(newLead);
      } catch (err) {
        console.error('Error in onLeadSubmitted:', err);
      }
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFullName('');
    setPhone('');
    setEmail('');
    setNote('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Đóng form"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 sm:p-12 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-vw-blue">
                Đăng Ký Thông Tin Thành Công!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Cảm ơn <strong>{fullName}</strong> đã quan tâm. Chuyên viên tư vấn của <strong>Volkswagen Thế Kiệt</strong> sẽ liên hệ với bạn trong thời gian sớm nhất.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-md mx-auto text-left space-y-1">
              <div><strong>Dòng xe quan tâm:</strong> {model || 'Tất cả dòng xe'}</div>
              <div><strong>Số điện thoại:</strong> {phone}</div>
              <div><strong>Nhu cầu:</strong> {need}</div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:${info.hotline}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-vw-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi Hotline Ngay: {info.hotlineFormatted}</span>
              </a>

              <button
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Trở Về Trang Chủ
              </button>
            </div>
          </div>
        ) : (
          /* Lead Form Screen */
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            
            {/* Left Column: Form */}
            <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
              
              <div>
                <span className="text-[11px] font-black tracking-widest text-vw-cyan uppercase">
                  Volkswagen Thế Kiệt
                </span>
                <h2 className="text-2xl font-black text-vw-blue tracking-tight">
                  NHẬN BÁO GIÁ & ƯU ĐÃI
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Quý khách vui lòng để lại thông tin, Volkswagen Thế Kiệt sẽ gửi bảng giá lăn bánh và ưu đãi mới nhất!
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và Tên <span className="text-vw-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-vw-blue transition-all"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số điện thoại <span className="text-vw-red">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-vw-blue transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-vw-blue transition-all"
                    />
                  </div>
                </div>

                {/* Model & Need */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dòng xe quan tâm <span className="text-vw-red">*</span>
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-vw-blue transition-all"
                    >
                      <option value="">-- Vui lòng chọn xe --</option>
                      {CARS_DATA.map((car) => (
                        <option key={car.id} value={car.name}>
                          {car.name}
                        </option>
                      ))}
                      <option value="Khác">Dòng xe khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nhu cầu của bạn
                    </label>
                    <select
                      value={need}
                      onChange={(e) => setNeed(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-vw-blue transition-all"
                    >
                      <option value="Nhận báo giá">Nhận báo giá ưu đãi</option>
                      <option value="Đăng kí lái thử">Đăng ký lái thử tận nơi</option>
                      <option value="Tư vấn trả góp">Tư vấn trả góp ngân hàng</option>
                      <option value="Đặt lịch dịch vụ">Đặt lịch hẹn dịch vụ</option>
                    </select>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi chú thêm
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Địa chỉ nhận báo giá, thời gian lái thử mong muốn..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-vw-blue transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-vw-blue hover:bg-vw-blue-light text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Đang gửi thông tin...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>GỬI THÔNG TIN NGAY</span>
                    </>
                  )}
                </button>

              </form>

            </div>

            {/* Right Column: Visual representation */}
            <div className="hidden md:block md:col-span-5 relative bg-slate-900">
              <img
                src="https://volkswagengolden.vn/wp-content/uploads/2026/05/05_DSCF9306-1024x742.jpg"
                alt="Volkswagen Thế Kiệt"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-white space-y-2">
                <div className="flex items-center gap-1.5 text-vw-cyan text-xs font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cam kết đại lý</span>
                </div>
                <h4 className="text-sm font-bold">
                  Báo giá chính xác & Hỗ trợ tận tâm
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Bảo mật thông tin khách hàng tuyệt đối. Tư vấn 24/7 kể cả ngày nghỉ và lễ Tết.
                </p>
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 block uppercase">Hotline hỗ trợ:</span>
                  <a href={`tel:${info.hotline}`} className="text-sm font-black text-vw-red hover:underline">
                    {info.hotlineFormatted}
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
