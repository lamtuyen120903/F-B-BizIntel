import React, { useState } from 'react';
import { Input } from '../Input';
import { Button } from '../Button';

interface RegisterStepProps {
  onNext: (userInfo: { name: string; phone: string; shopName: string }) => void;
  onPrev: () => void;
}

export const RegisterStep: React.FC<RegisterStepProps> = ({ onNext, onPrev }) => {
  const [form, setForm] = useState({ name: '', phone: '', shopName: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.phone) {
      onNext(form);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in flex flex-col justify-center min-h-[60vh]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Đăng ký để xem chi tiết</h2>
        <p className="text-sm text-slate-500">Xem báo cáo P&L đầy đủ & Phân tích hòa vốn</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-emerald-100 space-y-4">
        <Input 
          label="Tên chủ quán"
          placeholder="Nguyễn Văn A"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          required
        />
        <Input 
          label="Số điện thoại (Zalo)"
          placeholder="0912..."
          value={form.phone}
          onChange={(e) => setForm({...form, phone: e.target.value})}
          type="tel"
          required
        />
        <Input 
          label="Tên quán"
          placeholder="Coffee House"
          value={form.shopName}
          onChange={(e) => setForm({...form, shopName: e.target.value})}
        />
        
        <div className="flex gap-3 mt-4">
           <Button type="button" onClick={onPrev} variant="outline" className="w-1/3">Quay lại</Button>
           <Button type="submit" className="flex-1">
             HOÀN TẤT & XEM BÁO CÁO
           </Button>
        </div>
      </form>
    </div>
  );
};