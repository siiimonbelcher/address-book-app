'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseCSV } from '@/lib/import-export/csv-parser'
import { parseVCard } from '@/lib/import-export/vcard-parser'
import { revalidatePath } from 'next/cache'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function importContacts(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const file = formData.get('file') as File

    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: 'File size exceeds 5MB limit' }
    }

    // Validate MIME type
    const validTypes = ['text/csv', 'text/vcard', 'text/x-vcard']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|vcf|vcard)$/i)) {
      return { success: false, error: 'Invalid file type. Only CSV and vCard files are supported.' }
    }

    // Read file content
    const content = await file.text()

    if (!content.trim()) {
      return { success: false, error: 'File is empty' }
    }

    // Parse based on file type
    const isVCard = file.name.match(/\.(vcf|vcard)$/i) || file.type.includes('vcard')
    const parseResult = isVCard ? parseVCard(content) : parseCSV(content)

    if (parseResult.contacts.length === 0) {
      return {
        success: false,
        error: 'No valid contacts found in file',
        details: parseResult.errors,
      }
    }

    // Import contacts
    const userId = session.user?.id
    if (!userId) {
      return { success: false, error: 'User ID not found' }
    }

    const created = await prisma.contact.createMany({
      data: parseResult.contacts.map((contact) => ({
        ...contact,
        userId,
      })),
    })

    revalidatePath('/contacts')
    revalidatePath('/dashboard')

    return {
      success: true,
      imported: created.count,
      total: parseResult.totalRows,
      errors: parseResult.errors,
    }
  } catch (error) {
    console.error('Import error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import contacts',
    }
  }
}
