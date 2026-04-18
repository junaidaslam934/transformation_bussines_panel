import React, { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onSelect, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <button
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-[15px] text-black font-ceraPro min-w-[120px] justify-between"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <span>{selected}</span>
        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}><path d="M12.7458 0.995977L6.91288 6.82893C6.85871 6.88316 6.79438 6.92618 6.72357 6.95554C6.65276 6.98489 6.57686 7 6.5002 7C6.42355 7 6.34765 6.98489 6.27683 6.95554C6.20602 6.92618 6.14169 6.88316 6.08752 6.82893L0.254569 0.995977C0.172901 0.9144 0.117274 0.810425 0.0947293 0.697217C0.0721848 0.584008 0.0837367 0.466655 0.127923 0.360015C0.172109 0.253376 0.246942 0.162244 0.342949 0.0981569C0.438956 0.0340698 0.551819 -9.06601e-05 0.667251 1.80705e-07H12.3332C12.4486 -9.06601e-05 12.5614 0.0340698 12.6575 0.0981569C12.7535 0.162244 12.8283 0.253376 12.8725 0.360015C12.9167 0.466655 12.9282 0.584008 12.9057 0.697217C12.8831 0.810425 12.8275 0.9144 12.7458 0.995977Z" fill="#8B8D91"/></svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              className={`block w-full text-left px-4 py-2 text-[15px] font-ceraPro text-black hover:bg-gray-100 ${option === selected ? 'bg-gray-100' : ''}`}
              onClick={() => { onSelect(option); setOpen(false); }}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
