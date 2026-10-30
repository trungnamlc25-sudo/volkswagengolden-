import React, { useState, useEffect } from 'react';
import { X, Trash2, Download, Users, Phone, Mail, Calendar, Car } from 'lucide-react';
import type { Lead } from '../types/car';

interface AdminLeadViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLeadViewer: React.FC<AdminLeadViewerProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const loadLeads = () => {
    try {
      const data = localStorage.getItem('vw_golden_leads');
      if (data) {
        setLeads(JSON.parse(data));
      } else {
        setLeads([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLeads();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách khách hàng này không?')) {
      localStorage.removeItem('vw_golden_leads');
      setLeads([]);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const header = 'ID,Ho_Va_Ten,So_Dien_Thoai,Email,Dong_Xe,Nhu_Cau,Ghi_Chu,Thoi_Gian\n';
    const rows = leads.map(l => 
      `"${l.id}","${l.fullName}","${l.phone}","${l.email || ''}","${l.model}","${l.need}","${l.note || ''}","${l.createdAt}"`
    ).join('\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_vw_golden_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-vw-blue" />
            <h3 className="text-base font-extrabold text-vw-blue">
              Quản Lý Khách Hàng Đăng Ký Tư Vấn ({leads.length})
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {leads.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Xuất file Excel CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất CSV</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Xóa danh sách"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa hết</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {leads.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold">Chưa có khách hàng nào để lại thông tin.</p>
              <p className="text-xs text-slate-400">
                Khi khách hàng gửi form trên web, danh sách sẽ tự động hiển thị tại đây.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((l) => (
                <div key={l.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-vw-blue">{l.fullName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-vw-cyan/20 text-vw-blue font-bold text-[10px]">
                        {l.need}
                      </span>
                    </div>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {l.createdAt}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-vw-red" />
                      <a href={`tel:${l.phone}`} className="font-bold text-slate-800 hover:underline">
                        {l.phone}
                      </a>
                    </div>

                    {l.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{l.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-vw-cyan" />
                      <span className="font-semibold text-slate-800">{l.model}</span>
                    </div>
                  </div>

                  {l.note && (
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[11px] mt-2">
                      <strong>Ghi chú:</strong> {l.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-vw-blue text-white font-bold text-xs uppercase"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
