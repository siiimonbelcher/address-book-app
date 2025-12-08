'use server'

import { signIn } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/security/password'
import { registerSchema, loginSchema } from '@/lib/validators'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function register(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const validated = registerSchema.parse(data)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return { error: 'User with this email already exists' }
    }

    // Hash password and create user
    const passwordHash = await hashPassword(validated.password)

    await prisma.user.create({
      data: {
        email: validated.email,
        name: validated.name,
        passwordHash,
      },
    })

    // Auto-login after registration
    await signIn('credentials', {
      email: validated.email,
      password: validated.password,
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('NEXT_REDIRECT')) {
        throw error
      }
      return { error: error.message }
    }
    return { error: 'Registration failed' }
  }
}

export async function login(formData: FormData) {
  try {
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const validated = loginSchema.parse(data)

    await signIn('credentials', {
      email: validated.email,
      password: validated.password,
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password' }
        default:
          return { error: 'Something went wrong' }
      }
    }
    throw error
  }
}

export async function logout() {
  redirect('/api/auth/signout')
}
