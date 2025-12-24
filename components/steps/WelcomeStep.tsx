
import React from 'react';
import { Button } from '../Button';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full justify-center items-center text-center space-y-10 animate-fade-in py-6">
      <div className="space-y-6">
        <div className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest">
          Dự án Công cụ Quản trị F&B Việt Nam (Bản Thử Nghiệm)
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-black text-slate-800 leading-tight px-2">
            Chào anh em chủ quán,
          </h1>
          <div className="text-slate-600 text-sm px-4 font-medium leading-relaxed space-y-4 text-justify">
            <p>
              Team mình đang phát triển một công cụ giúp anh em tính toán lãi lỗ và dòng tiền chính xác, thay thế cho việc nhẩm tính sơ sài. 
            </p>
            <p>
              Đây là <strong>bản Lite (Rút gọn)</strong> để anh em test thử logic. Nếu thấy hữu ích, hãy ủng hộ để team có động lực hoàn thiện bản Chi tiết (Full) nhé.
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full space-y-4 px-2">
        <Button onClick={onNext} fullWidth className="h-16 text-lg font-black shadow-xl shadow-emerald-100 rounded-[1.2rem] border-none">
          DÙNG THỬ NGAY
        </Button>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic opacity-70">Sản phẩm phi lợi nhuận vì cộng đồng</p>
      </div>
    </div>
  );
};
