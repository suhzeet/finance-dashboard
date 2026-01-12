
import React from 'react';
import { useStore } from '../context/StoreContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'neon-purple';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400/30',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600',
    'neon-purple': 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] border border-purple-400/30',
    danger: 'bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 transition-colors',
    ghost: 'hover:bg-slate-500/10 text-slate-500 hover:text-cyan-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button 
      className={`rounded-lg font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => {
  const { state } = useStore();
  const isDark = state.settings.theme === 'dark';
  
  return (
    <div className={`backdrop-blur-md border rounded-xl transition-all duration-500 overflow-hidden ${
      isDark 
        ? 'bg-[#0c111d]/60 border-slate-800/50 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
        : 'bg-white border-slate-200 shadow-sm hover:border-cyan-500/50 hover:shadow-lg'
    } ${className}`}>
      {title && (
        <div className={`px-6 py-4 border-b ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
          <h3 className="font-orbitron text-sm font-bold tracking-widest text-cyan-600 uppercase">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; icon?: React.ReactNode }> = ({ label, icon, className = '', ...props }) => {
  const { state } = useStore();
  const isDark = state.settings.theme === 'dark';

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input 
          className={`w-full border rounded-lg ${icon ? 'pl-10 pr-4' : 'px-4'} py-2.5 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600 ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-inner'
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, className = '', ...props }) => {
  const { state } = useStore();
  const isDark = state.settings.theme === 'dark';

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">{label}</label>}
      <select 
        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all ${
          isDark ? 'bg-slate-900/60 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-inner'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export const Badge: React.FC<{ variant?: 'success' | 'warning' | 'error' | 'info'; children: React.ReactNode }> = ({ variant = 'info', children }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    info: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${styles[variant]}`}>
      {children}
    </span>
  );
};
