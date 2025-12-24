import React, { useState } from 'react';
import { Input } from '../Input';
import { Button } from '../Button';
import { Ingredient, MenuItem, RecipeComponent } from '../../types';
import { formatCurrency, generateId } from '../../utils';

interface MenuStepProps {
  ingredients: Ingredient[];
  menu: MenuItem[];
  onChange: (menu: MenuItem[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MenuStep: React.FC<MenuStepProps> = ({ ingredients, menu, onChange, onNext, onPrev }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({
    name: '',
    sellingPrice: 0,
    sellingPriceApp: 0,
    components: [],
    wastagePercent: 5,
  });

  const addComponentRow = () => {
    // Add a blank component line
    const newComp: RecipeComponent = { ingredientId: '', quantity: 0 };
    setCurrentItem({
      ...currentItem,
      components: [...(currentItem.components || []), newComp]
    });
  };

  const updateComponentIngredient = (index: number, ingId: string) => {
    // Prevent duplicates
    if (currentItem.components?.some((c, i) => i !== index && c.ingredientId === ingId)) {
       return; // Or show error
    }

    const newComps = [...(currentItem.components || [])];
    newComps[index] = { ...newComps[index], ingredientId: ingId };
    setCurrentItem({ ...currentItem, components: newComps });
  };

  const updateComponentQuantity = (index: number, qty: number) => {
    const newComps = [...(currentItem.components || [])];
    newComps[index] = { ...newComps[index], quantity: qty };
    setCurrentItem({ ...currentItem, components: newComps });
  };

  const removeComponent = (index: number) => {
    const newComps = [...(currentItem.components || [])];
    newComps.splice(index, 1);
    setCurrentItem({ ...currentItem, components: newComps });
  };

  const calculateTotalCost = () => {
    if (!currentItem.components) return 0;
    const rawCost = currentItem.components.reduce((acc, comp) => {
      const ing = ingredients.find(i => i.id === comp.ingredientId);
      if (!ing) return acc;
      return acc + (ing.costPerBaseUnit * comp.quantity);
    }, 0);
    
    return rawCost * (1 + (currentItem.wastagePercent || 0) / 100);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setCurrentItem({
      name: item.name,
      sellingPrice: item.sellingPrice,
      sellingPriceApp: item.sellingPriceApp || item.sellingPrice, // Fallback if undefined
      components: [...item.components], // Copy array
      wastagePercent: item.wastagePercent,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!currentItem.name || !currentItem.sellingPrice) return;
    
    // Filter out invalid components (no ingredient selected)
    const validComponents = currentItem.components?.filter(c => c.ingredientId) || [];

    const newItem: MenuItem = {
      id: editingId || generateId(),
      name: currentItem.name,
      sellingPrice: currentItem.sellingPrice,
      sellingPriceApp: currentItem.sellingPriceApp || currentItem.sellingPrice, // Default to In-store price
      components: validComponents,
      wastagePercent: currentItem.wastagePercent || 0,
      totalCost: calculateTotalCost(),
    };
    
    if (editingId) {
      onChange(menu.map(m => m.id === editingId ? newItem : m));
    } else {
      onChange([...menu, newItem]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setCurrentItem({ name: '', sellingPrice: 0, sellingPriceApp: 0, components: [], wastagePercent: 5 });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Bước 5: Menu & Giá bán</h2>
        <p className="text-sm text-slate-500">Tính giá Cost (COGS) chính xác từng món</p>
      </div>

      {menu.length > 0 && !showForm && (
        <div className="space-y-4">
          {menu.map(item => {
            const cogsPercent = item.sellingPrice ? (item.totalCost / item.sellingPrice) * 100 : 0;
            return (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative">
                 <div className="flex justify-between items-start mb-2 pr-16">
                  <h4 className="font-bold text-lg text-slate-800 truncate">{item.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-bold whitespace-nowrap ${cogsPercent > 35 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    Cost: {cogsPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Giá tại quán:</span>
                    <span className="font-medium">{formatCurrency(item.sellingPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giá qua App:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(item.sellingPriceApp || item.sellingPrice)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-50 pt-1 mt-1">
                    <span>Giá vốn:</span>
                    <span className="text-slate-800">{formatCurrency(item.totalCost)}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-2 flex flex-col gap-1">
                   <button 
                    onClick={() => handleEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                     </svg>
                  </button>
                  <button 
                    onClick={() => onChange(menu.filter(m => m.id !== item.id))}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm ? (
        <div className="bg-white p-5 rounded-xl shadow-lg border-2 border-blue-100 animate-slide-up">
          <h3 className="font-bold text-lg mb-4 text-blue-800">{editingId ? 'Chỉnh sửa món' : 'Tạo món mới'}</h3>
          
          <Input 
            label="Tên món"
            placeholder="VD: Trà Sữa Trân Châu"
            value={currentItem.name}
            onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <Input 
              label="Giá tại quán"
              value={currentItem.sellingPrice ? formatCurrency(currentItem.sellingPrice).replace('₫', '').trim() : ''}
              onChange={(e) => setCurrentItem({...currentItem, sellingPrice: Number(e.target.value.replace(/\D/g, ''))})}
              suffix="VNĐ"
            />
            <Input 
              label="Giá qua App"
              value={currentItem.sellingPriceApp ? formatCurrency(currentItem.sellingPriceApp).replace('₫', '').trim() : ''}
              onChange={(e) => setCurrentItem({...currentItem, sellingPriceApp: Number(e.target.value.replace(/\D/g, ''))})}
              suffix="VNĐ"
            />
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium text-slate-700 mb-2">Thành phần (Nguyên liệu + Bao bì)</label>
             
             {/* List of current components */}
             <div className="space-y-3 mb-3">
               {currentItem.components?.map((comp, idx) => {
                 const selectedIng = ingredients.find(i => i.id === comp.ingredientId);
                 return (
                   <div key={idx} className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded border border-slate-200">
                     <div className="flex-1">
                       <select 
                          className="w-full p-2 bg-white border border-slate-300 rounded focus:border-emerald-500 outline-none"
                          value={comp.ingredientId}
                          onChange={(e) => updateComponentIngredient(idx, e.target.value)}
                       >
                         <option value="">-- Chọn NL --</option>
                         {ingredients.map(ing => (
                           <option key={ing.id} value={ing.id}>{ing.name}</option>
                         ))}
                       </select>
                     </div>
                     <div className="flex items-center gap-1 w-24">
                        <input 
                            type="number"
                            className="w-full p-2 border border-slate-300 rounded text-center"
                            placeholder="SL"
                            value={comp.quantity || ''}
                            onChange={(e) => updateComponentQuantity(idx, Number(e.target.value))}
                        />
                        <span className="text-[10px] text-slate-500 w-6">
                          {selectedIng ? selectedIng.type : ''}
                        </span>
                     </div>
                     <button onClick={() => removeComponent(idx)} className="text-red-400 p-1 hover:bg-red-50 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                     </button>
                   </div>
                 )
               })}
             </div>

             <Button 
               onClick={addComponentRow} 
               variant="outline" 
               className="w-full text-sm border-dashed border-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
               type="button"
             >
               + Thêm thành phần
             </Button>
          </div>

          <div className="mb-4">
            <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-1">
              <span>Tỷ lệ hao hụt (%)</span>
              <span className="text-xs font-normal text-slate-500">Trung bình 2-5%</span>
            </label>
            <input 
              type="number" 
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={currentItem.wastagePercent}
              onChange={(e) => setCurrentItem({...currentItem, wastagePercent: Number(e.target.value)})}
            />
          </div>
          
          <div className="bg-slate-800 text-white p-3 rounded mb-4 flex justify-between items-center">
             <span>Giá vốn thực tế:</span>
             <span className="font-bold text-lg">{formatCurrency(calculateTotalCost())}</span>
          </div>

          <div className="flex gap-3">
            <Button onClick={resetForm} variant="outline" className="flex-1">Hủy</Button>
            <Button onClick={handleSave} className="flex-1">Lưu Món</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline" fullWidth className="border-dashed border-2 py-4">
          + Thêm món vào Menu
        </Button>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg z-10">
         <div className="flex gap-3">
            <Button onClick={onPrev} variant="outline" className="w-1/3">Quay lại</Button>
            <Button onClick={onNext} className="flex-1" disabled={menu.length === 0}>
              TIẾP THEO
            </Button>
         </div>
      </div>
    </div>
  );
};