'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { loginSchema, type LoginInput } from '@/lib/validations'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (res?.error) {
        toast.error('Invalid credentials')
        return
      }
      const session = await getSession()
      if (session?.user?.role !== 'ADMIN') {
        toast.error('This account does not have admin access.')
        return
      }
      toast.success('Welcome, admin!')
      router.push('/admin')
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
      <h1 className="font-display text-3xl text-forest">Admin Login — Thinnie Aurvadic</h1>
      <p className="mt-1 text-sm text-warmgray">Sign in with your admin account to manage the store.</p>
      <div className="mt-6 space-y-4">
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
      </div>
      <Button loading={loading} size="lg" className="mt-6 w-full">
        Sign in
      </Button>
      <p className="mt-4 text-center text-sm">
        <Link href="/" className="font-semibold text-forest hover:underline">
          ← Back to store
        </Link>
      </p>
    </form>
  )
}
