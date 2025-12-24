
import React from 'react';
import { AppState } from '../types';
import { Input } from './Input';
import { Button } from './Button';
import { formatCurrency, formatNumber } from '../utils';

interface LiteAppProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const LiteApp: React.FC<LiteAppProps> = ({ state, setState }) => {
  const { lite, step, waitlist } = state;

  const updateLite = (updates: Partial<AppState['lite']>) => {
    setState(prev => ({ ...prev, lite: { ...prev.lite, ...updates } }));
  };

  const updateWaitlist = (updates: Partial<AppState['waitlist']>) => {
    setState(prev => ({ ...prev, waitlist: { ...prev.waitlist, ...updates } }));
  };

  const setStep = (s: number) => setState(prev => ({ ...prev, step: s }));

  // Logic tính toán quy đổi về tháng
  const monthlyDepreciation = Math.round(lite.investment / (lite.recoveryYears * 12)) || 0;
  const monthlyFixedOps = lite.rent + lite.payroll + lite.otherOps;
  
  const monthlyStoreRev = lite.revenueInputMode === 'day' ? lite.storeRevenue * 30 : lite.storeRevenue;
  const monthlyAppRev = lite.revenueInputMode === 'day' ? lite.appRevenue * 30 : lite.appRevenue;
  
  const totalMonthlyRev = monthlyStoreRev + monthlyAppRev;
  const monthlyAppFees = Math.round(monthlyAppRev * (lite.appCommissionRate / 100));
  const monthlyCOGS = Math.round(totalMonthlyRev * (lite.cogsRate / 100));
  const operatingProfit = totalMonthlyRev - monthlyAppFees - monthlyCOGS - monthlyFixedOps;
  const netProfit = operatingProfit - monthlyDepreciation;

  const renderInputCosts = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Chi phí đầu tư</h2>
        <p className="text-slate-500 text-sm font-medium">Khoản vốn bạn đã bỏ ra ban đầu</p>
      </div>

      <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 space-y-6">
        <Input label="Tổng vốn đầu tư" placeholder="Máy móc, decor, cọc..." value={lite.investment ? formatNumber(lite.investment) : ''} onChange={(e) => updateLite({ investment: Number(e.target.value.replace(/\D/g, '')) })} suffix="đ" />
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
            <span>Kế hoạch gỡ vốn</span>
            <span className="text-emerald-600 font-bold">{lite.recoveryYears} Năm</span>
          </div>
          <input type="range" min="1" max="5" step="1" className="w-full accent-emerald-500 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer" value={lite.recoveryYears} onChange={(e) => updateLite({ recoveryYears: Number(e.target.value) })} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Vận hành cố định (Opex)</h3>
        <Input label="Mặt bằng / tháng" placeholder="20.000.000" value={lite.rent ? formatNumber(lite.rent) : ''} onChange={(e) => updateLite({ rent: Number(e.target.value.replace(/\D/g, '')) })} suffix="đ" />
        <Input label="Tổng lương nhân sự" placeholder="35.000.000" value={lite.payroll ? formatNumber(lite.payroll) : ''} onChange={(e) => updateLite({ payroll: Number(e.target.value.replace(/\D/g, '')) })} suffix="đ" />
        <Input label="Vận hành khác" helperText="Điện, nước, internet..." value={lite.otherOps ? formatNumber(lite.otherOps) : ''} onChange={(e) => updateLite({ otherOps: Number(e.target.value.replace(/\D/g, '')) })} suffix="đ" />
      </div>

      <Button fullWidth onClick={() => setStep(2)} className="h-16 text-lg font-black shadow-lg shadow-emerald-50 rounded-[1.2rem]">TIẾP THEO →</Button>
    </div>
  );

  const renderInputRevenue = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Doanh thu dự kiến</h2>
        <p className="text-slate-500 text-sm font-medium">Tiền thu về và giá vốn hàng bán</p>
      </div>

      <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 space-y-6">
        {/* Chế độ nhập Doanh thu */}
        <div className="flex bg-slate-50 p-1 rounded-xl">
           <button 
             onClick={() => updateLite({ revenueInputMode: 'month' })}
             className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${lite.revenueInputMode === 'month' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
           >
             Theo tháng
           </button>
           <button 
             onClick={() => updateLite({ revenueInputMode: 'day' })}
             className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${lite.revenueInputMode === 'day' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
           >
             Theo ngày
           </button>
        </div>

        <Input 
          label={`Bán tại quán (${lite.revenueInputMode === 'month' ? 'Tháng' : 'Ngày'})`} 
          value={lite.storeRevenue ? formatNumber(lite.storeRevenue) : ''} 
          onChange={(e) => updateLite({ storeRevenue: Number(e.target.value.replace(/\D/g, '')) })} 
          suffix="đ" 
        />
        <Input 
          label={`Bán qua App Food (${lite.revenueInputMode === 'month' ? 'Tháng' : 'Ngày'})`} 
          value={lite.appRevenue ? formatNumber(lite.appRevenue) : ''} 
          onChange={(e) => updateLite({ appRevenue: Number(e.target.value.replace(/\D/g, '')) })} 
          suffix="đ" 
        />
      </div>

      <div className="bg-emerald-50 p-6 rounded-[1.5rem] border border-emerald-100 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-black text-emerald-800 uppercase tracking-widest">Tỷ lệ COGS (%)</label>
          <span className="text-2xl font-black text-emerald-600">{lite.cogsRate}%</span>
        </div>
        <input type="range" min="20" max="60" step="1" className="w-full accent-emerald-500 h-1.5 bg-emerald-200/50 rounded-full appearance-none cursor-pointer" value={lite.cogsRate} onChange={(e) => updateLite({ cogsRate: Number(e.target.value) })} />
        <p className="text-[10px] text-emerald-700/80 font-medium italic">
          "Ước tính trung bình chi phí cost nguyên liệu trên doanh thu"
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" className="w-1/3 h-14 rounded-[1.2rem] border-slate-200" onClick={() => setStep(1)}>Quay lại</Button>
        <Button className="flex-1 h-14 font-black rounded-[1.2rem] shadow-lg shadow-emerald-50" onClick={() => setStep(3)}>XEM KẾT QUẢ →</Button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800">Kết quả ước tính</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Báo cáo P&L (Lãi/Lỗ) hàng tháng</p>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(16,185,129,0.06)] border border-slate-100">
        <div className="text-center space-y-1 mb-8">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lợi nhuận ròng dự kiến (Net)</span>
           <div className={`text-4xl font-black tracking-tighter ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
             {formatCurrency(netProfit)}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm font-bold">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">Doanh thu</span>
            <span className="text-slate-700">{formatCurrency(totalMonthlyRev)}</span>
          </div>
          <div className="bg-red-50/50 p-4 rounded-2xl">
            <span className="text-[10px] text-red-400 block mb-1 uppercase tracking-wider">Tiền hàng</span>
            <span className="text-red-600">-{formatCurrency(monthlyCOGS)}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">Vận hành</span>
            <span className="text-slate-700">-{formatCurrency(monthlyFixedOps)}</span>
          </div>
          <div className="bg-blue-50/50 p-4 rounded-2xl">
            <span className="text-[10px] text-blue-400 block mb-1 uppercase tracking-wider">Khấu hao</span>
            <span className="text-blue-600">-{formatCurrency(monthlyDepreciation)}</span>
          </div>
        </div>

        <div className="mt-8 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 text-[10px] text-orange-800 leading-relaxed font-medium italic">
          <strong>Lưu ý:</strong> Kết quả này dựa trên các con số trung bình bạn nhập. Thực tế vận hành sẽ có sai số do hao hụt nguyên liệu, chấm công nhân sự và chi phí bảo trì.
        </div>
      </div>

      {/* KHỐI 2: KHẢO SÁT NHU CẦU */}
      <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] p-8 space-y-4 shadow-sm">
        <h3 className="font-black text-emerald-900 text-lg text-center uppercase tracking-tight">BẠN CÓ MUỐN SỬ DỤNG BẢN CHI TIẾT KHÔNG?</h3>
        <div className="text-emerald-800/80 text-sm leading-relaxed space-y-3 font-medium">
          <p>Team dự định phát triển tiếp <strong>Bản Full</strong> với các tính năng chuyên sâu:</p>
          <ul className="space-y-1.5 list-none pl-0">
            <li className="flex items-start gap-2">✅ <span>Tính Cost (giá vốn) chính xác từng gram nguyên liệu.</span></li>
            <li className="flex items-start gap-2">✅ <span>Tính lương theo giờ/sổ chấm công thực tế.</span></li>
            <li className="flex items-start gap-2">✅ <span>Phân tích menu món nào lãi/lỗ (BCG Matrix).</span></li>
          </ul>
          <p className="font-bold pt-2 border-t border-emerald-200/50">
            Việc phát triển tốn khá nhiều nguồn lực, team cần biết liệu anh em có thực sự cần nó không?
          </p>
        </div>
        <Button onClick={() => setStep(4)} className="w-full h-16 bg-emerald-600 text-white font-black rounded-[1.2rem] shadow-xl shadow-emerald-200 border-none transition-transform active:scale-95">
          TÔI CẦN BẢN CHI TIẾT NÀY - HÃY LÀM NÓ!
        </Button>
      </div>

      {/* KHỐI 3: ỦNG HỘ TINH THẦN */}
      <div className="text-center space-y-4 py-4">
         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hoặc chỉ cần ủng hộ tinh thần team bằng một nút Share:</p>
         <button className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-8 py-3.5 rounded-full text-xs font-black shadow-lg shadow-blue-100 active:scale-95 transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Like & Share bài viết Facebook
         </button>
      </div>
      
      <div className="text-center">
         <button onClick={() => setStep(2)} className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-emerald-500 transition-colors">
           Điều chỉnh lại số liệu
         </button>
      </div>
    </div>
  );

  const renderWaitlist = () => (
    <div className="space-y-6 animate-fade-in py-6">
      <div className="text-center space-y-4 mb-8">
        <div className="text-4xl">❤️</div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cảm ơn bạn đã 'bỏ phiếu' ủng hộ!</h2>
        <p className="text-slate-500 text-sm font-medium px-4 leading-relaxed">
          Chúng tôi sẽ ưu tiên hoàn thiện và gửi bản Full sớm nhất cho những anh em đăng ký tại đây. Bạn sẽ là những người đầu tiên được trải nghiệm (Beta Testers).
        </p>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-emerald-50 space-y-4">
        <Input label="Tên của bạn" placeholder="Ví dụ: Nguyễn Văn A" value={waitlist.name} onChange={(e) => updateWaitlist({ name: e.target.value })} />
        <Input label="Tên Quán" placeholder="Ví dụ: OCO Coffee" value={waitlist.shopName} onChange={(e) => updateWaitlist({ shopName: e.target.value })} />
        <Input label="Số điện thoại Zalo" placeholder="Để gửi thông báo khi làm xong" value={waitlist.phone} onChange={(e) => updateWaitlist({ phone: e.target.value })} type="tel" />
        
        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bạn mong chờ tính năng nào nhất?</label>
           <select 
             className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 appearance-none shadow-sm"
             value={waitlist.favoriteFeature}
             onChange={(e) => updateWaitlist({ favoriteFeature: e.target.value })}
           >
             <option value="Tính giá vốn">Tính giá vốn (Recipe Costing)</option>
             <option value="Quản lý kho">Quản lý kho nguyên liệu</option>
             <option value="Quản lý nhân viên">Quản lý nhân viên & chấm công</option>
             <option value="Phân tích menu">Phân tích menu lãi/lỗ</option>
           </select>
        </div>

        <Button onClick={() => setStep(5)} fullWidth className="h-16 mt-6 font-black rounded-[1.2rem] shadow-xl shadow-emerald-50">
          GỬI ĐĂNG KÝ & ỦNG HỘ TEAM
        </Button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col h-full justify-center items-center text-center space-y-8 animate-fade-in py-10 px-4">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
         </svg>
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Đã ghi nhận! ❤️</h2>
        <p className="text-slate-500 text-sm font-medium leading-relaxed px-2">
          Team sẽ đẩy nhanh tiến độ để sớm ra mắt phục vụ anh em. Trong lúc chờ đợi, bạn có thể tham gia Cộng đồng Zalo để góp ý trực tiếp các tính năng bạn muốn có.
        </p>
      </div>
      
      <div className="w-full space-y-4">
        <a href="https://zalo.me/g/community_link" target="_blank" rel="noopener noreferrer" className="block w-full h-16 bg-[#0068ff] text-white flex items-center justify-center font-black rounded-[1.2rem] shadow-xl shadow-blue-100 no-underline active:scale-95 transition-transform">
          THAM GIA NHÓM ZALO
        </a>
        <button onClick={() => setStep(0)} className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 transition-colors py-2">
          Quay lại từ đầu
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      {step === 1 && renderInputCosts()}
      {step === 2 && renderInputRevenue()}
      {step === 3 && renderResults()}
      {step === 4 && renderWaitlist()}
      {step === 5 && renderSuccess()}
    </div>
  );
};
