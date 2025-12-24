import React from 'react';
import { Input } from '../Input';
import { Button } from '../Button';
import { OpexData } from '../../types';
import { formatCurrency } from '../../utils';

interface OpexStepProps {
  data: OpexData;
  onChange: (data: OpexData) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const OpexStep: React.FC<OpexStepProps> = ({ data, onChange, onNext, onPrev }) => {

  const handleInputChange = (field: keyof OpexData, value: string) => {
    const num = Number(value.replace(/\D/g, ''));
    onChange({ ...data, [field]: num });
  };

  const addOtherExpense = () => {
    onChange({
      ...data,
      others: [...data.others, { name: 'Chi phí khác', amount: 0 }]
    });
  };

  const updateOtherExpenseName = (index: number, name: string) => {
    const newOthers = [...data.others];
    newOthers[index].name = name;
    onChange({ ...data, others: newOthers });
  };

  const updateOtherExpenseAmount = (index: number, amount: number) => {
    const newOthers = [...data.others];
    newOthers[index].amount = amount;
    onChange({ ...data, others: newOthers });
  };

  const removeOtherExpense = (index: number) => {
    const newOthers = data.others.filter((_, i) => i !== index);
    onChange({ ...data, others: newOthers });
  };

  const totalOpex = data.rent + data.utilities + data.marketing + data.others.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
       <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Bước 2: Chi phí "Nuôi quán"</h2>
        <p className="text-sm text-slate-500">Chi phí cố định hàng tháng (Không bao gồm nhân sự)</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <Input
          label="Tiền thuê mặt bằng/tháng"
          value={data.rent ? formatCurrency(data.rent).replace('₫', '').trim() : ''}
          onChange={(e) => handleInputChange('rent', e.target.value)}
          suffix="VNĐ"
        />
        <Input
          label="Điện + Nước + Internet + Rác"
          helperText="Ước tính trung bình tháng"
          value={data.utilities ? formatCurrency(data.utilities).replace('₫', '').trim() : ''}
          onChange={(e) => handleInputChange('utilities', e.target.value)}
          suffix="VNĐ"
        />
        <Input
          label="Marketing Cố định"
          helperText="Chạy Ads, lương Admin page, in ấn..."
          value={data.marketing ? formatCurrency(data.marketing).replace('₫', '').trim() : ''}
          onChange={(e) => handleInputChange('marketing', e.target.value)}
          suffix="VNĐ"
        />
        
        {data.others.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-start bg-slate-50 p-2 rounded-lg border border-slate-100">
            <div className="flex-1 space-y-2">
               {/* Name Input */}
               <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateOtherExpenseName(idx, e.target.value)}
                  placeholder="Tên khoản chi (VD: Phần mềm)"
                  className="w-full p-2 text-sm font-medium border border-slate-300 rounded focus:border-emerald-500 outline-none bg-white"
               />
               
               {/* Amount Input */}
               <div className="relative">
                 <input
                    type="text"
                    value={item.amount ? formatCurrency(item.amount).replace('₫', '').trim() : ''}
                    onChange={(e) => updateOtherExpenseAmount(idx, Number(e.target.value.replace(/\D/g, '')))}
                    placeholder="0"
                    className="w-full p-2 pr-8 text-sm border border-slate-300 rounded focus:border-emerald-500 outline-none bg-white font-mono text-right"
                 />
                 <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">VNĐ</span>
               </div>
            </div>
            
            <button 
              onClick={() => removeOtherExpense(idx)}
              className="mt-1 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa khoản chi này"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}

        <div className="pt-2">
          <Button onClick={addOtherExpense} variant="outline" fullWidth type="button" className="text-sm py-2">
            + Thêm khoản chi khác
          </Button>
        </div>
      </div>

      <div className="bg-slate-100 p-4 rounded-lg flex justify-between items-center sticky bottom-0 border-t border-slate-200">
        <span className="font-semibold text-slate-600">Tổng vận hành:</span>
        <span className="font-bold text-xl text-slate-800">{formatCurrency(totalOpex)}</span>
      </div>

      <div className="flex gap-3">
        <Button onClick={onPrev} variant="outline" className="w-1/3">Quay lại</Button>
        <Button onClick={onNext} className="flex-1">TIẾP THEO</Button>
      </div>
    </div>
  );
};