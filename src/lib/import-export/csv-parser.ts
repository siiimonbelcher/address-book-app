import Papa from 'papaparse'
import { contactSchema } from '../validators'

export interface ParsedContact {
  firstName: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  notes?: string
}

export interface ParseResult {
  contacts: ParsedContact[]
  errors: string[]
  totalRows: number
  successCount: number
}

export function parseCSV(csvContent: string): ParseResult {
  const errors: string[] = []
  const contacts: ParsedContact[] = []

  try {
    const result = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize headers to match our schema
        const normalized = header.toLowerCase().trim()
        const mapping: Record<string, string> = {
          'first name': 'firstName',
          firstname: 'firstName',
          'last name': 'lastName',
          lastname: 'lastName',
          'e-mail': 'email',
          'email address': 'email',
          'phone number': 'phone',
          telephone: 'phone',
          'street address': 'address',
          'zip code': 'zipCode',
          zip: 'zipCode',
          postal: 'zipCode',
          'postal code': 'zipCode',
        }
        return mapping[normalized] || normalized
      },
    })

    if (result.errors.length > 0) {
      errors.push(
        ...result.errors.map((e) => `Row ${e.row}: ${e.message}`)
      )
    }

    result.data.forEach((row: any, index: number) => {
      try {
        // Validate and parse the row
        const validated = contactSchema.parse({
          firstName: row.firstName || row.first_name || row.name || '',
          lastName: row.lastName || row.last_name || '',
          email: row.email || '',
          phone: row.phone || '',
          address: row.address || '',
          city: row.city || '',
          state: row.state || '',
          zipCode: row.zipCode || row.zip || '',
          country: row.country || '',
          notes: row.notes || '',
        })

        contacts.push(validated)
      } catch (error) {
        if (error instanceof Error) {
          errors.push(`Row ${index + 2}: ${error.message}`)
        } else {
          errors.push(`Row ${index + 2}: Invalid data`)
        }
      }
    })

    return {
      contacts,
      errors,
      totalRows: result.data.length,
      successCount: contacts.length,
    }
  } catch (error) {
    errors.push(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return {
      contacts: [],
      errors,
      totalRows: 0,
      successCount: 0,
    }
  }
}
