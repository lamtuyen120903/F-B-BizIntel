
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95";
  
  const variants = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200 border-none",
    secondary: "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-200 border-none",
    outline: "border-2 border-slate-100 text-slate-600 hover:border-emerald-100 hover:bg-emerald-50/30 bg-white",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
