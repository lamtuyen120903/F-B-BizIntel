import React from 'react';
import { Input } from '../Input';
import { Button } from '../Button';
import { Role } from '../../types';
import { formatCurrency, generateId } from '../../utils';

interface PayrollStepProps {
  roles: Role[];
  onChange: (roles: Role[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PayrollStep: React.FC<PayrollStepProps> = ({ roles, onChange, onNext, onPrev }) => {
  const addRole = () => {
    const newRole: Role = {
      id: generateId(),
      name: '',
      type: 'hourly',
      count: 1,
      hourlyRate: 0,
      totalHours: 0,
      fixedSalary: 0
    };
    onChange([...roles, newRole]);
  };

  const updateRole = (id: string, updates: Partial<Role>) => {
    onChange(roles.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const removeRole = (id: string) => {
    onChange(roles.filter(r => r.id !== id));
  };

  const calculateRoleCost = (role: Role) => {
    if (role.type === 'hourly') {
      return (role.hourlyRate || 0) * (role.totalHours || 0);
    }
    return (role.fixedSalary || 0) * (role.count || 1);
  };

  const totalPayroll = roles.reduce((acc, role) => acc + calculateRoleCost(role), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-40">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Bước 3: Đội ngũ nhân sự</h2>
        <p className="text-sm text-slate-500">Tính quỹ lương dựa trên thực tế chấm công</p>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4 flex gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 min-w-[20px]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Bạn hãy xem tổng giờ làm trong sổ chấm công tháng trước để nhập cho chính xác nhé.
      </div>

      {roles.map((role, idx) => (
        <div key={role.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative">
          <button 
            onClick={() => removeRole(role.id)}
            className="absolute top-4 right-4 text-slate-300 hover:text-red-500"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
          </button>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tên vị trí (VD: Barista)"
              value={role.name}
              onChange={(e) => updateRole(role.id, { name: e.target.value })}
              className="font-bold text-lg text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 outline-none w-full bg-transparent"
            />
          </div>

          <div className="flex gap-4 mb-4">
             <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Loại lương</label>
                <select 
                  value={role.type}
                  onChange={(e) => updateRole(role.id, { type: e.target.value as 'hourly' | 'fixed' })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="hourly">Theo giờ</option>
                  <option value="fixed">Lương cứng</option>
                </select>
             </div>
             <div className="flex-1">
                <Input 
                   label="Số lượng NS" 
                   type="number" 
                   value={role.count} 
                   onChange={(e) => updateRole(role.id, { count: Number(e.target.value) })}
                   className="mb-0"
                />
             </div>
          </div>

          {role.type === 'hourly' ? (
            <div className="grid grid-cols-2 gap-4">
               <Input 
                  label="Lương giờ"
                  placeholder="25,000"
                  value={role.hourlyRate ? formatCurrency(role.hourlyRate).replace('₫', '').trim() : ''}
                  onChange={(e) => updateRole(role.id, { hourlyRate: Number(e.target.value.replace(/\D/g, '')) })}
                  suffix="đ/h"
                  className="mb-0"
               />
               <Input 
                  label="Tổng giờ công"
                  helperText="Tổng tất cả NS"
                  placeholder="400"
                  value={role.totalHours}
                  onChange={(e) => updateRole(role.id, { totalHours: Number(e.target.value.replace(/\D/g, '')) })}
                  suffix="giờ"
                  className="mb-0"
               />
            </div>
          ) : (
            <Input 
                label="Lương cứng / Người"
                placeholder="6,000,000"
                value={role.fixedSalary ? formatCurrency(role.fixedSalary).replace('₫', '').trim() : ''}
                onChange={(e) => updateRole(role.id, { fixedSalary: Number(e.target.value.replace(/\D/g, '')) })}
                suffix="VNĐ"
                className="mb-0"
            />
          )}
          
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm text-slate-500">Thành tiền:</span>
            <span className="font-bold text-emerald-600">{formatCurrency(calculateRoleCost(role))}</span>
          </div>
        </div>
      ))}

      <Button onClick={addRole} variant="outline" fullWidth className="border-dashed border-2">
        + Thêm vị trí khác
      </Button>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg z-10 flex flex-col gap-2">
         <div className="flex justify-between items-center mb-1">
           <span className="text-slate-600 font-medium">Tổng quỹ lương:</span>
           <span className="text-xl font-bold text-emerald-700">{formatCurrency(totalPayroll)}</span>
         </div>
         <div className="flex gap-3">
            <Button onClick={onPrev} variant="outline" className="w-1/3">Quay lại</Button>
            <Button onClick={onNext} className="flex-1">TIẾP THEO</Button>
         </div>
      </div>
    </div>
  );
};