import React, { useState } from 'react';
import { CARS_DATA } from '../data/carsData';
import type { CarModel } from '../types/car';
import { ChevronRight, Landmark } from 'lucide-react';

interface PriceCalculatorProps {
  selectedCar: CarModel | null;
  onOpenLeadModal: (modelName?: string, needType?: string, noteInfo?: string) => void;
  cars?: CarModel[];
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  selectedCar,
  onOpenLeadModal,
  cars = CARS_DATA
}) => {
  const carList = cars && cars.length > 0 ? cars : CARS_DATA;

  // Select which car to calculate
  const [carId, setCarId] = useState<string>(selectedCar ? selectedCar.id : carList[0].id);
  
  // Province selection: 'hcm' | 'hanoi' | 'other'
  const [province, setProvince] = useState<'hcm' | 'hanoi' | 'other'>('hcm');

  // Insurance option
  const [includePhysicalInsurance, setIncludePhysicalInsurance] = useState<boolean>(true);

  // Loan parameters
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20); // 20%
  const [loanYears, setLoanYears] = useState<number>(5); // 5 years (60 months)
  const [interestRate, setInterestRate] = useState<number>(7.5); // 7.5%/year

  // Active car
  const activeCar = carList.find((c) => c.id === carId) || carList[0];

  // Price calculations
  const carPrice = activeCar.priceNumber;

  // Registration Tax (Thuế trước bạ)
  const taxRate = province === 'hanoi' ? 0.12 : 0.10;
  const registrationTax = Math.round(carPrice * taxRate);

  // License plate fee (Phí cấp biển số)
  const plateFee = province === 'hcm' || province === 'hanoi' ? 20000000 : 1000000;

  // Road maintenance fee (Phí đường bộ 1 năm cá nhân)
  const roadFee = 1560000;

  // Inspection fee (Phí đăng kiểm)
  const inspectionFee = 340000;

  // Mandatory Civil Liability Insurance (Bảo hiểm TNDS)
  const liabilityInsurance = activeCar.specs.seats > 5 ? 873000 : 480700;

  // Physical car damage insurance (Bảo hiểm vật chất ~1.3%)
  const physicalInsurance = includePhysicalInsurance ? Math.round(carPrice * 0.013) : 0;

  // Total On-the-road Price (Tổng chi phí lăn bánh)
  const totalOnTheRoad = carPrice + registrationTax + plateFee + roadFee + inspectionFee + liabilityInsurance + physicalInsurance;

  // Installment Calculations
  const downPaymentAmount = Math.round((totalOnTheRoad * downPaymentPercent) / 100);
  const loanAmount = totalOnTheRoad - downPaymentAmount;
  const loanMonths = loanYears * 12;

  // Monthly principal (Gốc hàng tháng)
  const monthlyPrincipal = Math.round(loanAmount / loanMonths);

  // Monthly first interest (Lãi tháng đầu ước tính)
  const monthlyFirstInterest = Math.round((loanAmount * (interestRate / 100)) / 12);

  // Total first monthly payment (Gốc + Lãi tháng đầu)
  const totalFirstMonth = monthlyPrincipal + monthlyFirstInterest;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleRequestQuote = () => {
    const provinceText = province === 'hcm' ? 'TP. Hồ Chí Minh' : province === 'hanoi' ? 'Hà Nội' : 'Tỉnh khác';
    const note = `Dự toán lăn bánh tại ${provinceText}. Dự kiến trả trước ${downPaymentPercent}%, vay ${loanYears} năm.`;
    onOpenLeadModal(activeCar.name, 'Tư vấn trả góp', note);
  };

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-black tracking-widest text-vw-cyan uppercase">
            CÔNG CỤ TÍNH TIỆN ÍCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-vw-blue tracking-tight">
            Dự Toán Chi Phí Lăn Bánh & Trả Góp
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Ước tính chính xác chi phí hoàn tất thủ tục đăng ký xe và số tiền trả góp hàng tháng khi vay mua xe qua ngân hàng.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6">
            
            {/* Step 1: Select Car Model */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Chọn dòng xe Volkswagen
              </label>
              <select
                value={carId}
                onChange={(e) => setCarId(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-300 text-slate-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-vw-blue transition-all"
              >
                {carList.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} ({car.priceText})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Province */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Nơi đăng ký lăn bánh
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setProvince('hcm')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    province === 'hcm'
                      ? 'bg-vw-blue text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  TP. HCM (10%)
                </button>
                <button
                  type="button"
                  onClick={() => setProvince('hanoi')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    province === 'hanoi'
                      ? 'bg-vw-blue text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Hà Nội (12%)
                </button>
                <button
                  type="button"
                  onClick={() => setProvince('other')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    province === 'other'
                      ? 'bg-vw-blue text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Tỉnh Khác (10%)
                </button>
              </div>
            </div>

            {/* Insurance Toggle */}
            <div className="flex items-center space-x-3 pt-1">
              <input
                type="checkbox"
                id="physicalInsurance"
                checked={includePhysicalInsurance}
                onChange={(e) => setIncludePhysicalInsurance(e.target.checked)}
                className="w-4 h-4 text-vw-blue rounded border-slate-300 focus:ring-vw-blue"
              />
              <label htmlFor="physicalInsurance" className="text-xs text-slate-700 font-medium cursor-pointer">
                Tính thêm Bảo hiểm vật chất xe (ước tính 1.3% giá xe)
              </label>
            </div>

            <hr className="border-slate-200" />

            {/* Installment Parameters */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. Tỷ lệ trả trước: <span className="text-vw-blue font-black">{downPaymentPercent}%</span>
                </label>
                <span className="text-xs font-semibold text-slate-500">
                  Vay {100 - downPaymentPercent}%
                </span>
              </div>
              <div className="flex gap-2">
                {[15, 20, 30, 50, 70].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDownPaymentPercent(pct)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      downPaymentPercent === pct
                        ? 'bg-vw-cyan text-vw-dark font-black shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Duration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  4. Thời hạn vay: <span className="text-vw-blue font-black">{loanYears} Năm ({loanMonths} Tháng)</span>
                </label>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setLoanYears(yr)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      loanYears === yr
                        ? 'bg-vw-blue text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {yr}N
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Interest Rate Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Lãi suất ngân hàng ước tính:
                </label>
                <span className="text-xs font-bold text-vw-blue">{interestRate}% / năm</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="11.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full accent-vw-blue"
              />
            </div>

          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* On The Road Breakdown Card */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-vw-cyan/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-vw-cyan tracking-wider uppercase">
                    TỔNG CHI PHÍ ƯỚC TÍNH
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {activeCar.name}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                  {province === 'hcm' ? 'TP.HCM' : province === 'hanoi' ? 'Hà Nội' : 'Tỉnh thành'}
                </span>
              </div>

              {/* Price Details */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>1. Giá niêm yết xe:</span>
                  <span className="font-bold text-white">{formatCurrency(carPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>2. Lệ phí trước bạ ({taxRate * 100}%):</span>
                  <span className="font-bold text-white">{formatCurrency(registrationTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>3. Phí cấp biển số:</span>
                  <span className="font-bold text-white">{formatCurrency(plateFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>4. Phí đăng kiểm:</span>
                  <span className="font-bold text-white">{formatCurrency(inspectionFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>5. Phí bảo trì đường bộ (1 năm):</span>
                  <span className="font-bold text-white">{formatCurrency(roadFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>6. Bảo hiểm TNDS bắt buộc (1 năm):</span>
                  <span className="font-bold text-white">{formatCurrency(liabilityInsurance)}</span>
                </div>
                {includePhysicalInsurance && (
                  <div className="flex justify-between">
                    <span>7. Bảo hiểm vật chất (tự nguyện):</span>
                    <span className="font-bold text-white">{formatCurrency(physicalInsurance)}</span>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="pt-4 border-t border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="block text-xs font-medium text-slate-400">
                    Tổng chi phí lăn bánh:
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-vw-cyan">
                    {formatCurrency(totalOnTheRoad)}
                  </span>
                </div>
              </div>

              {/* Installment Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-vw-cyan uppercase tracking-wider">
                  <Landmark className="w-4 h-4" />
                  <span>Ước tính gói vay trả góp ngân hàng</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Trả trước ({downPaymentPercent}%):</span>
                    <span className="text-sm font-bold text-white">{formatCurrency(downPaymentAmount)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Vay ngân hàng:</span>
                    <span className="text-sm font-bold text-white">{formatCurrency(loanAmount)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Gốc trả hàng tháng:</span>
                    <span className="text-xs font-bold text-slate-200">{formatCurrency(monthlyPrincipal)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block">Gốc + Lãi tháng đầu:</span>
                    <span className="text-sm font-black text-amber-400">{formatCurrency(totalFirstMonth)}/tháng</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  * Số tiền trả góp giảm dần theo dư nợ thực tế hàng tháng.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleRequestQuote}
                className="w-full py-4 bg-vw-cyan hover:bg-vw-cyan-hover text-vw-dark font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Nhận Bảng Tính Chi Tiết Qua Zalo / Email</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
