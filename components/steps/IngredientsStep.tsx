import React, { useState } from 'react';
import { Input } from '../Input';
import { Button } from '../Button';
import { Ingredient, UnitType } from '../../types';
import { formatCurrency, generateId } from '../../utils';

interface IngredientsStepProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const IngredientsStep: React.FC<IngredientsStepProps> = ({ ingredients, onChange, onNext, onPrev }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Temporary state for the form
  const [formState, setFormState] = useState<Partial<Ingredient>>({
    name: '',
    type: UnitType.LIQUID,
    unitIn: 'Thùng',
    unitPrice: 0,
    conversionRate: 0,
  });
  
  // Helper state for conversion calculator
  const [packQuantity, setPackQuantity] = useState<number>(1); // e.g., 24 boxes in a carton
  const [unitSize, setUnitSize] = useState<number>(0); // e.g., 380g per box

  const handleEdit = (ing: Ingredient) => {
    setEditingId(ing.id);
    setFormState({
      name: ing.name,
      type: ing.type,
      unitIn: ing.unitIn,
      unitPrice: ing.unitPrice,
      conversionRate: ing.conversionRate,
    });
    setPackQuantity(ing.packQuantity || 1);
    setUnitSize(ing.unitSize || 0);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formState.name || !formState.unitPrice) return;
    
    // Logic: If user selects Carton/Box, we need total base units.
    let totalBaseUnits = 0;

    if (formState.type === UnitType.UNIT) {
       // e.g. Buy 1 Bag (50 pcs). packQuantity = 50. unitSize ignored.
       totalBaseUnits = packQuantity;
    } else {
       // e.g. Buy 1 Carton (24 boxes), each 380g. 
       totalBaseUnits = packQuantity * unitSize;
    }

    // Fallback if user enters 0 to avoid Infinity
    if (totalBaseUnits === 0) totalBaseUnits = 1;

    const costPerBase = (formState.unitPrice || 0) / totalBaseUnits;

    const ingredientData: Ingredient = {
      id: editingId || generateId(),
      name: formState.name!,
      type: formState.type!,
      unitIn: formState.unitIn!,
      unitPrice: formState.unitPrice!,
      conversionRate: totalBaseUnits,
      costPerBaseUnit: costPerBase,
      packQuantity: packQuantity,
      unitSize: unitSize,
    };

    if (editingId) {
      onChange(ingredients.map(i => i.id === editingId ? ingredientData : i));
    } else {
      onChange([...ingredients, ingredientData]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormState({
      name: '',
      type: UnitType.LIQUID,
      unitIn: 'Thùng',
      unitPrice: 0,
    });
    setPackQuantity(1);
    setUnitSize(0);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Bước 4: Sổ tay đi chợ</h2>
        <p className="text-sm text-slate-500">Thiết lập giá vốn đầu vào theo chuẩn (g, ml, cái)</p>
      </div>

      {ingredients.length > 0 && !showForm && (
        <div className="space-y-3 mb-6">
          {ingredients.map(ing => (
            <div key={ing.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-800">{ing.name}</h4>
                <p className="text-xs text-slate-500">
                  Mua {formatCurrency(ing.unitPrice)}/{ing.unitIn}
                  {' -> '}
                  <span className="text-emerald-600 font-semibold">
                    {Math.round(ing.costPerBaseUnit)}đ/{ing.type}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(ing)} 
                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                   </svg>
                </button>
                <button 
                  onClick={() => onChange(ingredients.filter(i => i.id !== ing.id))} 
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="bg-white p-5 rounded-xl shadow-lg border-2 border-emerald-100 animate-slide-up">
          <h3 className="font-bold text-lg mb-4 text-emerald-800">{editingId ? 'Chỉnh sửa nguyên liệu' : 'Thêm nguyên liệu mới'}</h3>
          
          <Input 
            label="Tên nguyên liệu"
            placeholder="VD: Sữa đặc Ông Thọ"
            value={formState.name}
            onChange={(e) => setFormState({...formState, name: e.target.value})}
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Loại hàng</label>
            <div className="flex gap-2">
              {[
                { label: 'Chất lỏng (ml)', val: UnitType.LIQUID },
                { label: 'Chất rắn (gr)', val: UnitType.SOLID },
                { label: 'Cái (pcs)', val: UnitType.UNIT },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setFormState({...formState, type: opt.val})}
                  className={`flex-1 py-2 text-xs rounded-md border ${formState.type === opt.val ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Đơn vị mua</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg bg-white"
                  value={formState.unitIn}
                  onChange={(e) => setFormState({...formState, unitIn: e.target.value})}
                >
                  {['Thùng', 'Hộp', 'Chai', 'Lít', 'Kg', 'Bịch', 'Gói', 'Cây'].map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
             </div>
             <Input 
                label="Giá mua"
                value={formState.unitPrice ? formatCurrency(formState.unitPrice).replace('₫', '').trim() : ''}
                onChange={(e) => setFormState({...formState, unitPrice: Number(e.target.value.replace(/\D/g, ''))})}
                suffix="đ"
                className="mb-0"
             />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Công thức quy đổi</p>
            <div className="grid grid-cols-1 gap-3">
               <div className="flex items-center gap-2 text-sm">
                  <span className="whitespace-nowrap w-24">1 {formState.unitIn} có:</span>
                  <input 
                    type="number" 
                    className="w-20 p-1 border rounded text-center font-bold text-emerald-700"
                    value={packQuantity}
                    onChange={(e) => setPackQuantity(Number(e.target.value))}
                  />
                  <span>{formState.type === UnitType.UNIT ? 'cái (pcs)' : (formState.unitIn === 'Thùng' ? 'hộp/gói' : 'đơn vị nhỏ')}</span>
               </div>
               
               {formState.type !== UnitType.UNIT && (
                 <div className="flex items-center gap-2 text-sm">
                    <span className="whitespace-nowrap w-24">Mỗi đơn vị nặng:</span>
                    <input 
                      type="number" 
                      className="w-20 p-1 border rounded text-center font-bold text-emerald-700"
                      value={unitSize}
                      onChange={(e) => setUnitSize(Number(e.target.value))}
                    />
                    <span>{formState.type}</span>
                 </div>
               )}
            </div>
            
            <div className="mt-3 text-right text-xs text-slate-400">
               ~ Giá cost: {((formState.unitPrice || 0) / (Math.max(1, (formState.type === UnitType.UNIT ? packQuantity : packQuantity * unitSize)))).toFixed(2)}đ / {formState.type}
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={resetForm} variant="outline" className="flex-1">Hủy</Button>
            <Button onClick={handleSave} className="flex-1">Lưu</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline" fullWidth className="border-dashed border-2 py-4">
          + Thêm nguyên liệu (Sữa, Trà, Ly...)
        </Button>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg z-10">
         <div className="flex gap-3">
            <Button onClick={onPrev} variant="outline" className="w-1/3">Quay lại</Button>
            <Button onClick={onNext} className="flex-1" disabled={ingredients.length === 0}>
              {ingredients.length === 0 ? 'Hãy thêm ít nhất 1 NL' : 'TIẾP THEO'}
            </Button>
         </div>
      </div>
    </div>
  );
};