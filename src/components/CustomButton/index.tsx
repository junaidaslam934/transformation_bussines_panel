import React from 'react'


interface IProps {
  children: React.ReactNode;
  variant?: 'with_bg' | 'default';
  icon?: React.ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}
export default function CustomButton({ children, icon, variant = 'default', onClick, className, type = 'button', disabled = false }: IProps) {
  return (
    <>
      {
        variant === 'with_bg' ?
          <button disabled={disabled} type={type} onClick={onClick ? onClick : () => null} className={`rounded-[8px] bg-primary text-white py-2 px-4 text-sm font-bold flex items-center justify-center gap-2 ${className}`}>
            {icon}
            {children}
          </button>
          :
          <button disabled={disabled} onClick={onClick ? onClick : () => null} className={`border border-primary rounded-[8px] text-primary py-2 px-5 text-sm font-bold flex items-center justify-center gap-3 ${className}`}>
            {icon}
            {children}
          </button>
      }
    </>
  )
}
