
import React, { useState } from 'react';
import { AppState, UnitType } from './types';
import { WelcomeStep } from './components/steps/WelcomeStep';
import { LiteApp } from './components/LiteApp';

// Updated initialState to include missing properties required by the new AppState interface
const initialState: AppState = {
  step: 0,
  lite: {
    investment: 0,
    recoveryYears: 3,
    rent: 0,
    payroll: 0,
    otherOps: 0,
    revenueInputMode: 'month',
    storeRevenue: 0,
    appRevenue: 0,
    appCommissionRate: 25,
    cogsRate: 35,
  },
  waitlist: {
    name: '',
    shopName: '',
    phone: '',
    favoriteFeature: 'Tính giá vốn',
  },
  simulationMode: 'month',
  sales: {
    inStore: {},
    delivery: {}
  },
  menu: [],
  discounts: { shop: 0, app: 25 },
  capex: {
    totalInvestment: 0,
    recoveryYears: 3,
    yearlyMaintenance: 0
  },
  opex: {
    rent: 0,
    utilities: 0,
    marketing: 0,
    others: []
  },
  roles: [],
  ingredients: []
};

function App() {
  const [state, setState] = useState<AppState>(initialState);

  const setStep = (step: number) => setState(prev => ({ ...prev, step }));

  return (
    <div className="min-h-screen bg-white md:bg-slate-50 flex flex-col items-center font-sans overflow-x-hidden">
      <div className="w-full max-w-md bg-white min-h-screen shadow-none md:shadow-2xl relative flex flex-col">
        {/* Header - Chân thành & Tinh gọn */}
        <div className="px-6 py-5 flex items-center justify-between bg-white border-b border-slate-50 sticky top-0 z-40">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xs">O</div>
              <h1 className="text-sm font-black text-slate-800 tracking-tighter uppercase">
                OCO biz<span className="text-emerald-500 font-medium lowercase italic ml-0.5">community</span>
              </h1>
           </div>
           {state.step > 0 && state.step < 3 && (
             <div className="flex gap-1.5 items-center">
               {[1, 2].map(i => (
                 <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-500 ${
                    state.step >= i ? 'bg-emerald-500 w-6' : 'bg-slate-100 w-2'
                  }`} 
                />
               ))}
             </div>
           )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {state.step === 0 ? (
            <WelcomeStep onNext={() => setStep(1)} />
          ) : (
            <LiteApp state={state} setState={setState} />
          )}
        </div>
        
        {/* Footer Gieo mầm (Chỉ ở màn hình nhập liệu) */}
        {(state.step === 1 || state.step === 2) && (
          <div className="p-4 text-center border-t border-slate-50 bg-slate-50/30">
            <p className="text-[10px] text-slate-400 font-medium italic">
              "Đang phát triển tính năng nhập chi tiết theo từng món..."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
