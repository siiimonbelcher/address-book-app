'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createContact(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
      country: formData.get('country') as string,
      notes: formData.get('notes') as string,
    }

    const validated = contactSchema.parse(data)

    const contact = await prisma.contact.create({
      data: {
        ...validated,
        userId: session.user.id,
      },
    })

    revalidatePath('/contacts')
    revalidatePath('/dashboard')

    redirect(`/contacts/${contact.id}`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Create contact error:', error)
    return { error: 'Failed to create contact' }
  }
}

export async function updateContact(id: string, formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    // Verify ownership
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    })

    if (!existingContact || existingContact.userId !== session.user.id) {
      throw new Error('Contact not found')
    }

    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zipCode: formData.get('zipCode') as string,
      country: formData.get('country') as string,
      notes: formData.get('notes') as string,
    }

    const validated = contactSchema.parse(data)

    await prisma.contact.update({
      where: { id },
      data: validated,
    })

    revalidatePath(`/contacts/${id}`)
    revalidatePath('/contacts')
    revalidatePath('/dashboard')

    redirect(`/contacts/${id}`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Update contact error:', error)
    return { error: 'Failed to update contact' }
  }
}

export async function deleteContact(id: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    // Verify ownership
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    })

    if (!existingContact || existingContact.userId !== session.user.id) {
      throw new Error('Contact not found')
    }

    await prisma.contact.delete({
      where: { id },
    })

    revalidatePath('/contacts')
    revalidatePath('/dashboard')

    redirect('/contacts')
  } catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Delete contact error:', error)
    return { error: 'Failed to delete contact' }
  }
}

export async function searchContacts(query: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    const contacts = await prisma.contact.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { email: { contains: query } },
          { phone: { contains: query } },
        ],
      },
      orderBy: { firstName: 'asc' },
    })

    return contacts
  } catch (error) {
    console.error('Search contacts error:', error)
    return []
  }
}
