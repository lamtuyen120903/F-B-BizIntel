
import React from 'react';
import { AppState } from '../types';
import { formatCurrency } from '../utils';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from './Button';

interface DashboardProps {
  state: AppState;
  onPrev: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onPrev }) => {
  // Constants
  const VAT_RATE = 0.08;

  // 1. Calculate Financials (Monthly Basis)
  const getMonthlyQty = (qty: number) => state.simulationMode === 'day' ? qty * 30 : qty;

  let monthlyGrossRevenue = 0;
  let totalGrossCOGS = 0;
  
  (Object.entries(state.sales.inStore) as [string, number][]).forEach(([id, qty]) => {
    const item = state.menu.find(m => m.id === id);
    if (item && qty > 0) {
      const monthlyQty = getMonthlyQty(qty);
      monthlyGrossRevenue += item.sellingPrice * monthlyQty * (1 - (state.discounts.shop / 100));
      totalGrossCOGS += item.totalCost * monthlyQty;
    }
  });

  (Object.entries(state.sales.delivery) as [string, number][]).forEach(([id, qty]) => {
    const item = state.menu.find(m => m.id === id);
    if (item && qty > 0) {
       const monthlyQty = getMonthlyQty(qty);
       const appPrice = item.sellingPriceApp || item.sellingPrice;
       monthlyGrossRevenue += appPrice * monthlyQty * (1 - (state.discounts.app / 100));
       totalGrossCOGS += item.totalCost * monthlyQty;
    }
  });

  const monthlyNetRevenue = monthlyGrossRevenue / (1 + VAT_RATE);
  const totalNetCOGS = totalGrossCOGS / (1 + VAT_RATE);
  const vatOutput = monthlyGrossRevenue - monthlyNetRevenue;
  const vatInput = totalGrossCOGS - totalNetCOGS;
  const vatPayable = vatOutput - vatInput;

  const monthlyMaintenance = state.capex.yearlyMaintenance / 12;
  const monthlyDepreciation = state.capex.totalInvestment / (state.capex.recoveryYears * 12);
  const opexFixed = state.opex.rent + state.opex.utilities + state.opex.marketing + state.opex.others.reduce((a, b) => a + b.amount, 0);
  const payrollCost = state.roles.reduce((acc, role) => {
    if (role.type === 'hourly') return acc + ((role.hourlyRate || 0) * (role.totalHours || 0));
    return acc + ((role.fixedSalary || 0) * (role.count || 1));
  }, 0);

  const totalOperatingCost = opexFixed + payrollCost + monthlyMaintenance;
  const grossProfit = monthlyNetRevenue - totalNetCOGS;
  const netProfitAfterCapex = grossProfit - totalOperatingCost - monthlyDepreciation;

  const grossMarginPercent = monthlyNetRevenue > 0 ? grossProfit / monthlyNetRevenue : 0;
  const fixedCostOps = opexFixed + payrollCost + monthlyMaintenance; 
  const breakEvenNetRevenueOps = grossMarginPercent > 0 ? fixedCostOps / grossMarginPercent : 0;
  const breakEvenGrossOps = breakEvenNetRevenueOps * (1 + VAT_RATE);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header Summary - Light Style */}
      <div className="bg-emerald-50 p-8 rounded-b-[2.5rem] -mx-5 -mt-5 mb-6 border-b border-emerald-100 shadow-sm relative">
        <button onClick={onPrev} className="absolute top-5 left-5 text-emerald-600 bg-white p-2 rounded-xl shadow-sm">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        <h2 className="text-center text-xs font-black text-emerald-600/70 uppercase tracking-widest mb-1">Lợi nhuận ròng dự kiến</h2>
        <div className="text-center text-4xl font-black text-emerald-600 mb-6 tracking-tight">
           {formatCurrency(netProfitAfterCapex)}
        </div>
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Doanh thu Net</p>
             <p className="text-sm font-black text-slate-700">{formatCurrency(monthlyNetRevenue)}</p>
           </div>
           <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Biên LN Gộp</p>
             <p className="text-sm font-black text-slate-700">{(grossMarginPercent * 100).toFixed(1)}%</p>
           </div>
        </div>
      </div>

      <div className="px-1 space-y-6">
        <section>
          <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            Chi tiết P&L
          </h3>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-4 flex justify-between bg-slate-50/50">
               <span className="text-sm font-bold text-slate-600">Doanh thu tổng (Gross)</span>
               <span className="text-sm font-black">{formatCurrency(monthlyGrossRevenue)}</span>
             </div>
             <div className="p-4 flex justify-between border-t border-slate-50">
               <span className="text-sm font-medium text-slate-500 italic">Doanh thu thuần</span>
               <span className="text-sm font-black text-emerald-600">{formatCurrency(monthlyNetRevenue)}</span>
             </div>
             <div className="p-4 flex justify-between border-t border-slate-50">
               <span className="text-sm font-medium text-slate-500">Giá vốn hàng bán (Net)</span>
               <span className="text-sm font-black text-red-500">-{formatCurrency(totalNetCOGS)}</span>
             </div>
             <div className="p-4 flex justify-between border-t border-slate-50 bg-emerald-50/20 font-bold">
               <span className="text-sm text-emerald-900">Lợi nhuận gộp</span>
               <span className="text-sm text-emerald-600">{formatCurrency(grossProfit)}</span>
             </div>
          </div>
        </section>

        <section className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
           <h4 className="font-black text-blue-900 mb-3 text-sm uppercase tracking-widest">Hòa vốn dự kiến</h4>
           <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-black text-blue-600">{formatCurrency(breakEvenGrossOps)}</p>
                <p className="text-[10px] font-bold text-blue-400 uppercase mt-1">Doanh thu Offline + Online</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-400">{(monthlyGrossRevenue / breakEvenGrossOps * 100).toFixed(0)}%</p>
                <p className="text-[10px] font-bold text-slate-300 uppercase">Tiến độ</p>
              </div>
           </div>
           <div className="w-full bg-blue-100 h-2 rounded-full mt-4 overflow-hidden">
             <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min((monthlyGrossRevenue/breakEvenGrossOps)*100, 100)}%` }}></div>
           </div>
        </section>
      </div>

      <div className="text-center pt-4">
         <Button onClick={onPrev} variant="outline" className="border-slate-200 text-slate-500 text-xs py-2 px-6 rounded-xl">Điều chỉnh dữ liệu</Button>
      </div>
    </div>
  );
};
