import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  primary:
    'bg-brand-600 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(76_29_149/0.4)] hover:bg-brand-700 disabled:bg-brand-600/60',
  gradient: 'bg-brand-gradient text-white shadow-glow hover:brightness-110 hover:saturate-125',
  dark: 'bg-ink text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] hover:bg-zinc-800',
  secondary: 'bg-white text-zinc-900 ring-1 ring-zinc-200 shadow-soft ring-inset hover:bg-zinc-50 hover:ring-zinc-300',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  ghost: 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  outlineDanger: 'text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-50',
  link: 'text-brand-700 underline-offset-4 hover:underline px-0 h-auto',
} as const;

const sizes = {
  sm: 'h-8 px-3 text-[13px] rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-5 text-[15px] rounded-xl gap-2',
  xl: 'h-14 px-7 text-base rounded-2xl gap-2.5',
  icon: 'h-9 w-9 rounded-lg',
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const buttonClasses = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) =>
  cn(
    'inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all duration-150 select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55',
    sizes[size],
    variants[variant],
    className,
  );

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, disabled, className, children, type = 'button', ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={buttonClasses(variant, size, className)} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
