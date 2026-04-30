'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true)
    try {
      await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      // Endpoint always returns 200 — show the same success state regardless,
      // so the user (and any onlooker) can't tell whether the email exists.
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-forest/10 bg-cream p-8 text-center shadow-warm-lg md:p-10">
        <h1 className="font-display text-3xl text-forest">Check Your Email</h1>
        <p className="mt-3 text-sm text-warmgray">
          If an account exists for that email, we've sent a password reset link.
          Please check your inbox (and spam folder).
        </p>
        <p className="mt-3 text-xs text-warmgray">The link expires in 1 hour.</p>
        <Link
          href="/login"
          className="mt-6 inline-block font-semibold text-forest hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-3xl border border-forest/10 bg-cream p-8 shadow-warm-lg md:p-10"
    >
      <h1 className="font-display text-3xl text-forest">Reset Your Password</h1>
      <p className="mt-1 text-sm text-warmgray">
        Enter the email tied to your account and we'll send you a reset link.
      </p>
      <div className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <Button loading={loading} size="lg" className="mt-6 w-full">
        Send reset link
      </Button>
      <p className="mt-4 text-center text-sm text-warmgray">
        Remembered it?{' '}
        <Link href="/login" className="font-semibold text-forest hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
