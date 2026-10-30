import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Link2, X, Check, HardDrive } from 'lucide-react';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  required?: boolean;
  helperText?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  helperText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedLocalPath, setSavedLocalPath] = useState<string | null>(null);

  // Compress & upload image directly to public/uploads/
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1600;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          let base64Result = event.target?.result as string;

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            base64Result = canvas.toDataURL('image/jpeg', 0.88);
          }

          // Try uploading to project's public/uploads/ folder via Vite API
          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                image: base64Result,
                name: file.name
              })
            });

            if (response.ok) {
              const data = await response.json();
              if (data.url) {
                onChange(data.url);
                setSavedLocalPath(data.url);
                setIsProcessing(false);
                return;
              }
            }
          } catch {
            // If API server is not running, fallback smoothly to base64
          }

          // Fallback to Base64 if API unavailable
          onChange(base64Result);
          setSavedLocalPath(null);
        } catch (err) {
          console.error(err);
          onChange(event.target?.result as string);
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        alert('Không thể đọc file hình ảnh này, vui lòng chọn file khác.');
        setIsProcessing(false);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const isStoredInProject = value && value.startsWith('/uploads/');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-700 text-xs">
          {label} {required && <span className="text-vw-red">*</span>}
        </label>
        
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-bold text-vw-cyan hover:underline flex items-center gap-1"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? 'Ẩn ô dán link URL' : 'Hoặc dán link URL trực tiếp'}</span>
        </button>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}

      {/* Main Upload Dropzone */}
      <div className="space-y-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-vw-blue rounded-2xl flex items-center justify-center gap-2.5 text-xs font-bold text-slate-700 transition-all group cursor-pointer shadow-xs"
          >
            <div className="w-8 h-8 rounded-full bg-vw-blue/10 text-vw-blue flex items-center justify-center group-hover:bg-vw-blue group-hover:text-white transition-colors">
              <Upload className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-slate-800 font-extrabold">
                {isProcessing ? 'Đang lưu ảnh vào project...' : 'Tải Ảnh Từ Máy Tính Lên'}
              </span>
              <span className="text-[10px] text-slate-400 font-normal flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-emerald-600" />
                <span>Tự động lưu file vào thư mục <code>public/uploads/</code> của project</span>
              </span>
            </div>
          </button>
        </div>

        {/* Optional Direct URL Input */}
        {showUrlInput && (
          <div className="animate-fadeIn">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setSavedLocalPath(null);
              }}
              placeholder="https://domain.com/hinh-anh.jpg hoặc /uploads/ten-anh.jpg"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-vw-blue"
            />
          </div>
        )}

        {/* Live Image Preview & File Path Badge */}
        {value ? (
          <div className="space-y-1.5 max-w-sm">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-xs">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={value}
                  alt="Xem trước hình ảnh"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-[11px] font-bold shadow hover:bg-slate-100 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Đổi ảnh khác</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setSavedLocalPath(null);
                  }}
                  className="p-1.5 rounded-xl bg-red-600 text-white shadow hover:bg-red-700"
                  title="Gỡ bỏ ảnh"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Đã chọn ảnh</span>
              </div>
            </div>

            {/* Path info banner */}
            {(isStoredInProject || savedLocalPath) && (
              <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-[10px] text-emerald-800 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="truncate">
                  File đã lưu: <strong>public{value}</strong>
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Chưa có hình ảnh. Vui lòng bấm <strong>"Tải Ảnh Từ Máy Tính Lên"</strong> ở trên để tải ảnh vào project.</span>
          </div>
        )}
      </div>
    </div>
  );
};
