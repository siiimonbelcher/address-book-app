'use client'

import { useState } from 'react'
import { register } from '@/actions/auth.actions'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await register(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      // Auto-login after registration
      const signInResult = await signIn('credentials', {
        email: result.email,
        password: result.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        router.push('/login')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name (optional)
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          disabled={loading}
        />
        <p className="text-xs text-gray-500">
          Must be at least 8 characters with uppercase, lowercase, and number
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:text-primary-light hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
