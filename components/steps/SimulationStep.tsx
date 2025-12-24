
import React, { useState } from 'react';
import { Button } from '../Button';
import { MenuItem, SalesData } from '../../types';
import { formatCurrency } from '../../utils';

interface SimulationStepProps {
  menu: MenuItem[];
  sales: SalesData;
  discounts: { app: number; shop: number };
  mode: 'day' | 'month';
  onModeChange: (mode: 'day' | 'month') => void;
  onSalesChange: (sales: SalesData) => void;
  onDiscountChange: (discounts: { app: number; shop: number }) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const SimulationStep: React.FC<SimulationStepProps> = ({ 
  menu, sales, discounts, mode, onModeChange, onSalesChange, onDiscountChange, onNext, onPrev 
}) => {
  const [channel, setChannel] = useState<'inStore' | 'delivery'>('inStore');

  const updateQuantity = (itemId: string, delta: number) => {
    const currentQty = sales[channel][itemId] || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    onSalesChange({
      ...sales,
      [channel]: {
        ...sales[channel],
        [itemId]: newQty
      }
    });
  };
  
  const updateQuantityDirect = (itemId: string, value: string) => {
    const newQty = Math.max(0, parseInt(value) || 0);
     onSalesChange({
      ...sales,
      [channel]: {
        ...sales[channel],
        [itemId]: newQty
      }
    });
  }

  // Calculate quick revenue estimation
  const calculateTotalRevenue = () => {
    let revenue = 0;
    
    // In-Store Revenue
    // Fix: Explicitly cast Object.entries to ensure qty is recognized as a number
    (Object.entries(sales.inStore) as [string, number][]).forEach(([id, qty]) => {
      const item = menu.find(m => m.id === id);
      if (item) {
        // Apply discount
        const price = item.sellingPrice * (1 - (discounts.shop / 100));
        revenue += price * qty;
      }
    });

    // App Revenue
    // Fix: Explicitly cast Object.entries to ensure qty is recognized as a number
    (Object.entries(sales.delivery) as [string, number][]).forEach(([id, qty]) => {
      const item = menu.find(m => m.id === id);
      if (item) {
        // Apply commission deduction (revenue you receive)
        // Use sellingPriceApp if available, else sellingPrice
        const appPrice = item.sellingPriceApp || item.sellingPrice;
        const price = appPrice * (1 - (discounts.app / 100));
        revenue += price * qty;
      }
    });

    // Adjust for Day/Month mode for display
    return mode === 'day' ? revenue * 30 : revenue;
  };

  return (
    <div className="space-y-4 animate-fade-in pb-28">
      <div className="flex items-center justify-between">
         <button onClick={onPrev} className="text-slate-400">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
         </button>
         <h2 className="text-lg font-bold text-slate-800">Bước 6: Tình hình kinh doanh</h2>
         <div className="w-6"></div>
      </div>
      
      {/* Time Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-lg">
        <button 
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === 'day' ? 'bg-emerald-400 text-white shadow' : 'text-slate-500'}`}
          onClick={() => onModeChange('day')}
        >
          Theo ngày (x30)
        </button>
        <button 
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === 'month' ? 'bg-emerald-400 text-white shadow' : 'text-slate-500'}`}
          onClick={() => onModeChange('month')}
        >
          Theo tháng
        </button>
      </div>

      {/* Channel Toggle */}
      <div className="flex gap-4">
        <button 
          onClick={() => setChannel('inStore')}
          className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${channel === 'inStore' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' : 'border-slate-100 bg-white text-slate-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Tại quán
        </button>
        <button 
          onClick={() => setChannel('delivery')}
          className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${channel === 'delivery' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' : 'border-slate-100 bg-white text-slate-500'}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Qua App
        </button>
      </div>

      <div className="flex justify-between items-end px-1">
        <h3 className="font-bold text-slate-800 text-lg">Menu bán {channel === 'inStore' ? 'tại quán' : 'qua App'}</h3>
        <span className="text-xs text-emerald-500 font-medium cursor-pointer flex items-center gap-1">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
           </svg>
           Tính hộ tôi
        </span>
      </div>

      <div className="space-y-4">
        {menu.map(item => {
          const displayPrice = channel === 'inStore' ? item.sellingPrice : (item.sellingPriceApp || item.sellingPrice);
          return (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                {/* Placeholder image */}
                <span className="text-2xl">☕</span>
              </div>
              <div className="flex-1">
                 <h4 className="font-bold text-slate-800">{item.name}</h4>
                 <p className="text-xs text-slate-400">Giá vốn: {formatCurrency(item.totalCost)}</p>
                 
                 <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400">Giá bán {channel === 'delivery' ? '(App)' : ''}</span>
                      <span className="font-bold text-slate-800">{formatCurrency(displayPrice)} <span className="text-[10px] font-normal text-slate-400">đ/dvt</span></span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-400 mb-1">Số lượng / {mode === 'day' ? 'ngày' : 'tháng'}</span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 flex items-center justify-center"
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          value={sales[channel][item.id] || ''} 
                          onChange={(e) => updateQuantityDirect(item.id, e.target.value)}
                          placeholder="0"
                          className="w-12 h-8 border border-slate-200 rounded-lg text-center font-bold text-slate-800 outline-none focus:border-emerald-500"
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-emerald-400 text-white font-bold hover:bg-emerald-500 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="font-bold text-slate-800 text-lg mt-6">
        {channel === 'inStore' ? 'Khuyến mãi tại quán' : 'Chiết khấu App Food'}
      </h3>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
         <div className="flex items-center justify-between">
           <div className="flex flex-col">
             <span className="font-bold text-slate-700">
               {channel === 'inStore' ? '% Khuyến mãi' : '% Chiết khấu App'}
             </span>
             <span className="text-xs text-slate-400">
               {channel === 'inStore' ? 'Giảm giá trung bình' : 'Phí sàn trung bình'}
             </span>
           </div>
           <div className="relative w-24">
             <input 
                type="number"
                value={channel === 'inStore' ? discounts.shop : discounts.app}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (channel === 'inStore') onDiscountChange({ ...discounts, shop: val });
                  else onDiscountChange({ ...discounts, app: val });
                }}
                className="w-full p-2 pr-6 bg-slate-50 border border-slate-200 rounded-lg text-right font-bold outline-none focus:border-emerald-500"
             />
             <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
           </div>
         </div>

         {/* Premium Teaser */}
         {channel === 'inStore' && (
           <div className="mt-4 border border-yellow-200 bg-yellow-50 rounded-lg p-3 relative overflow-hidden">
              <div className="flex gap-2 items-start text-xs text-slate-600 mb-2">
                 <span className="text-yellow-600 mt-0.5">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                   </svg>
                 </span>
                 Đây là mức tính toán ước lượng đơn giản trên tổng doanh thu tại quán.
              </div>
              <div className="bg-slate-900 rounded-lg p-3 flex items-center gap-3 text-white">
                 <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                 </div>
                 <div className="flex-1">
                   <div className="font-bold text-sm">Khuyến mãi nâng cao</div>
                   <div className="text-[10px] text-slate-400">Cấu hình chi tiết (Premium)</div>
                 </div>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                 </svg>
              </div>
           </div>
         )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
         <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-500">Tổng doanh thu dự kiến:</span>
            <span className="text-xl font-bold text-emerald-500">{formatCurrency(calculateTotalRevenue())}</span>
         </div>
         <Button onClick={onNext} fullWidth className="bg-emerald-400 hover:bg-emerald-500 shadow-emerald-200">
           Xem kết quả Lãi/Lỗ ->
         </Button>
      </div>
    </div>
  );
};
