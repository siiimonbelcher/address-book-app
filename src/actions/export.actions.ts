'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateCSV } from '@/lib/import-export/csv-generator'
import { generateVCard } from '@/lib/import-export/vcard-generator'

export async function exportContacts(format: 'csv' | 'vcard') {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: session.user.id },
      orderBy: { firstName: 'asc' },
    })

    if (contacts.length === 0) {
      return { success: false, error: 'No contacts to export' }
    }

    const content = format === 'csv' ? generateCSV(contacts) : generateVCard(contacts)

    return {
      success: true,
      content,
      filename: `contacts-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'vcf'}`,
      count: contacts.length,
    }
  } catch (error) {
    console.error('Export error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export contacts',
    }
  }
}
