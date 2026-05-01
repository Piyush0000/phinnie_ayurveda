'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'Could not create account')
        return
      }
      await signIn('credentials', { email: data.email, password: data.password, redirect: false })
      toast.success('Welcome to Thinnie Aurvadic!')
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-3xl border border-forest/10 bg-cream p-8 shadow-warm-lg md:p-10"
    >
      <h1 className="font-display text-3xl text-forest">Begin Your Journey</h1>
      <p className="mt-1 text-sm text-warmgray">Create an account for personalized recommendations.</p>
      <div className="mt-6 space-y-4">
        <Input label="Full Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          hint="At least 8 characters"
          {...register('password')}
        />
      </div>
      <Button loading={loading} size="lg" className="mt-6 w-full">
        Create Account
      </Button>
      <p className="mt-4 text-center text-sm text-warmgray">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-forest hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
