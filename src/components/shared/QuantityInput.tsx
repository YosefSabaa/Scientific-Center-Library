'use client';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 999,
  className,
}: QuantityInputProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        'inline-flex h-11 items-center rounded-xl border-2 border-border bg-white overflow-hidden',
        className
      )}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        className="flex h-full w-10 items-center justify-center transition-colors hover:bg-brand-purple/10 disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value) || min;
          onChange(Math.min(max, Math.max(min, v)));
        }}
        className="h-full w-14 border-none bg-transparent text-center font-semibold focus:outline-none"
      />
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        className="flex h-full w-10 items-center justify-center transition-colors hover:bg-brand-purple/10 disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}