import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const base =
  'w-full rounded-xl bg-white text-sm text-zinc-900 shadow-soft ring-1 ring-inset placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500';
const ringFor = (invalid?: boolean) => (invalid ? 'ring-red-300 focus:ring-red-500' : 'ring-zinc-200 hover:ring-zinc-300');

type WithError = { invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & WithError & { icon?: ReactNode }>(function Input(
  { className, invalid, icon, ...props },
  ref,
) {
  const input = <input ref={ref} aria-invalid={invalid || undefined} className={cn(base, ringFor(invalid), 'h-11 px-3.5', icon && 'pl-10', className)} {...props} />;
  if (!icon) return input;
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {input}
    </div>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & WithError>(function Textarea(
  { className, invalid, rows = 4, ...props },
  ref,
) {
  return <textarea ref={ref} rows={rows} aria-invalid={invalid || undefined} className={cn(base, ringFor(invalid), 'px-3.5 py-2.5 leading-relaxed', className)} {...props} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & WithError>(function Select({ className, invalid, children, ...props }, ref) {
  return (
    <div className="relative">
      <select ref={ref} aria-invalid={invalid || undefined} className={cn(base, ringFor(invalid), 'h-11 appearance-none pr-10 pl-3.5', className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden />
    </div>
  );
});
