'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// Client-side schema adds confirm-password match. The server validates only
// {token, newPassword} via resetPasswordSchema in lib/validations.ts.
const formSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
type FormInput = z.infer<typeof formSchema>

function ResetForm() {
  const sp = useSearchParams()
  const router = useRouter()
  const token = sp.get('token') ?? ''
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(formSchema) })

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-forest/10 bg-cream p-8 text-center shadow-warm-lg md:p-10">
        <h1 className="font-display text-3xl text-forest">Missing reset link</h1>
        <p className="mt-3 text-sm text-warmgray">
          This page needs a reset token. If you got here by mistake, request a new link.
        </p>
        <Link
          href="/forgot"
          className="mt-6 inline-block font-semibold text-forest hover:underline"
        >
          Request a reset link
        </Link>
      </div>
    )
  }

  const onSubmit = async (data: FormInput) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.newPassword }),
      })
      const body = await res.json()
      if (!res.ok) {
        toast.error(body.error || 'Could not reset password')
        return
      }
      setDone(true)
      toast.success('Password updated. Please sign in.')
      setTimeout(() => router.push('/login'), 1200)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-forest/10 bg-cream p-8 text-center shadow-warm-lg md:p-10">
        <h1 className="font-display text-3xl text-forest">Password Updated</h1>
        <p className="mt-3 text-sm text-warmgray">
          You're all set. Redirecting you to sign in…
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-3xl border border-forest/10 bg-cream p-8 shadow-warm-lg md:p-10"
    >
      <h1 className="font-display text-3xl text-forest">Choose a New Password</h1>
      <p className="mt-1 text-sm text-warmgray">
        Pick something you don't use anywhere else.
      </p>
      <div className="mt-6 space-y-4">
        <Input
          label="New Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>
      <Button loading={loading} size="lg" className="mt-6 w-full">
        Update password
      </Button>
      <p className="mt-4 text-center text-sm text-warmgray">
        <Link href="/login" className="font-semibold text-forest hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <ResetForm />
    </Suspense>
  )
}
