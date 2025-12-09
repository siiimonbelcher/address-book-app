'use server'

import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/security/password'
import { registerSchema } from '@/lib/validators'

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

    return { success: true, email: validated.email, password: validated.password }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Registration failed' }
  }
}

export async function logout() {
  redirect('/api/auth/signout')
}
