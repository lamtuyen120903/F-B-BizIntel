
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  suffix?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  helperText, 
  suffix,
  className = '', 
  ...props 
}) => {
  return (
    <div className={`mb-5 ${className}`}>
      {label && <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{label}</label>}
      <div className="relative group">
        <input 
          className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
          {...props}
        />
        {suffix && (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">
            {suffix}
          </span>
        )}
      </div>
      {helperText && <p className="mt-2 text-[10px] text-slate-400 font-medium italic ml-1 leading-tight">{helperText}</p>}
    </div>
  );
};
