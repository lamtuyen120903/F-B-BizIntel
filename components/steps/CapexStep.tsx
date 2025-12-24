import React from 'react';
import { Input } from '../Input';
import { Button } from '../Button';
import { CapexData } from '../../types';
import { formatCurrency } from '../../utils';

interface CapexStepProps {
  data: CapexData;
  onChange: (data: CapexData) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const CapexStep: React.FC<CapexStepProps> = ({ data, onChange, onNext, onPrev }) => {
  const monthlyDepreciation = Math.round(data.totalInvestment / (data.recoveryYears * 12));
  const monthlyMaintenance = Math.round(data.yearlyMaintenance / 12);
  const totalMonthlyBurden = monthlyDepreciation + monthlyMaintenance;

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/\D/g, ''));
    onChange({ ...data, totalInvestment: val });
  };

  const handleMaintenanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value.replace(/\D/g, ''));
    onChange({ ...data, yearlyMaintenance: val });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Bước 1: Tiền làm quán</h2>
        <p className="text-sm text-slate-500">Tính gánh nặng chi phí đầu tư lên từng tháng</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs flex items-center justify-center">1</span>
          Vốn ban đầu
        </h3>
        
        <Input
          label="Tổng tiền Decor + Máy móc + Cọc..."
          value={data.totalInvestment ? formatCurrency(data.totalInvestment).replace('₫', '').trim() : ''}
          onChange={handleInvestmentChange}
          placeholder="VD: 300.000.000"
          suffix="VNĐ"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Kế hoạch gỡ vốn trong: <span className="text-emerald-600 font-bold">{data.recoveryYears} năm</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={data.recoveryYears}
            onChange={(e) => onChange({ ...data, recoveryYears: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1 năm</span>
            <span>5 năm</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
         <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center">2</span>
          Bảo trì & Sửa chữa
        </h3>
        <Input
          label="Ước tính tiền sửa chữa mỗi năm"
          helperText="Ví dụ: Sơn sửa, thay bóng đèn, sửa máy..."
          value={data.yearlyMaintenance ? formatCurrency(data.yearlyMaintenance).replace('₫', '').trim() : ''}
          onChange={handleMaintenanceChange}
          placeholder="VD: 20.000.000"
          suffix="VNĐ/Năm"
        />
      </div>

      <div className="bg-slate-800 text-white p-4 rounded-lg">
        <p className="text-sm text-slate-300">Gánh nặng mỗi tháng:</p>
        <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalMonthlyBurden)}</p>
        <div className="text-xs text-slate-400 mt-1 flex gap-2">
           <span>Khấu hao: {formatCurrency(monthlyDepreciation)}</span>
           <span>+</span>
           <span>Bảo trì: {formatCurrency(monthlyMaintenance)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onPrev} variant="outline" className="w-1/3">Quay lại</Button>
        <Button onClick={onNext} className="flex-1">TIẾP THEO</Button>
      </div>
    </div>
  );
};