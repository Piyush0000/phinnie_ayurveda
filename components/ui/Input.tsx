'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? props.name
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-charcoal">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-white px-4 py-2.5 text-charcoal',
            'border-warmgray/30 focus:border-forest focus:ring-2 focus:ring-forest/20',
            'placeholder:text-warmgray/60 outline-none transition',
            error && 'border-terracotta focus:border-terracotta focus:ring-terracotta/20',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-terracotta">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-xs text-warmgray">{hint}</p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-charcoal">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-white px-4 py-2.5 text-charcoal',
            'border-warmgray/30 focus:border-forest focus:ring-2 focus:ring-forest/20',
            'placeholder:text-warmgray/60 outline-none transition',
            error && 'border-terracotta focus:border-terracotta focus:ring-terracotta/20',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-terracotta">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export default Input
