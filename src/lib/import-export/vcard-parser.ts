import { contactSchema } from '../validators'
import type { ParsedContact, ParseResult } from './csv-parser'

export function parseVCard(vcardContent: string): ParseResult {
  const errors: string[] = []
  const contacts: ParsedContact[] = []

  try {
    // Split by vCard boundaries
    const vcards = vcardContent.split(/BEGIN:VCARD/i).filter((v) => v.trim())

    vcards.forEach((vcard, index) => {
      try {
        const contact: ParsedContact = {
          firstName: '',
        }

        // Add back the BEGIN:VCARD
        const lines = ('BEGIN:VCARD' + vcard).split(/\r?\n/)

        lines.forEach((line) => {
          const trimmed = line.trim()
          if (!trimmed) return

          // Handle FN (Full Name) - often contains first + last name
          if (trimmed.match(/^FN[;:]/) || trimmed.startsWith('FN:')) {
            const value = trimmed.split(':').slice(1).join(':').trim()
            const parts = value.split(' ')
            if (parts.length > 0) {
              contact.firstName = parts[0]
              if (parts.length > 1) {
                contact.lastName = parts.slice(1).join(' ')
              }
            }
          }

          // Handle N (Name) - structured name field
          if (trimmed.match(/^N[;:]/) || trimmed.startsWith('N:')) {
            const value = trimmed.split(':').slice(1).join(':').trim()
            const parts = value.split(';')
            // Format: Family;Given;Additional;Prefix;Suffix
            if (parts.length > 1 && parts[1]) {
              contact.firstName = parts[1].trim()
            }
            if (parts.length > 0 && parts[0]) {
              contact.lastName = parts[0].trim()
            }
          }

          // Handle EMAIL
          if (trimmed.match(/^EMAIL[;:]/) || trimmed.startsWith('EMAIL:')) {
            const value = trimmed.split(':').slice(1).join(':').trim()
            if (!contact.email) {
              contact.email = value
            }
          }

          // Handle TEL (Phone)
          if (trimmed.match(/^TEL[;:]/) || trimmed.startsWith('TEL:')) {
            const value = trimmed.split(':').slice(1).join(':').trim()
            if (!contact.phone) {
              contact.phone = value
            }
          }

          // Handle ADR (Address)
          if (trimmed.match(/^ADR[;:]/) || trimmed.startsWith('ADR:')) {
            const value = trimmed.split(':').slice(1).join(':').trim()
            const parts = value.split(';')
            // Format: ;;Street;City;State;Postal;Country
            if (parts.length > 2 && parts[2]) {
              contact.address = parts[2].trim()
            }
            if (parts.length > 3 && parts[3]) {
              contact.city = parts[3].trim()
            }
            if (parts.length > 4 && parts[4]) {
              contact.state = parts[4].trim()
            }
            if (parts.length > 5 && parts[5]) {
              contact.zipCode = parts[5].trim()
            }
            if (parts.length > 6 && parts[6]) {
              contact.country = parts[6].trim()
            }
          }

          // Handle NOTE
          if (trimmed.match(/^NOTE[;:]/) || trimmed.startsWith('NOTE:')) {
            const value = trimmed.split(':').slice(1).join(':').trim()
            contact.notes = value
          }
        })

        // Validate the contact
        const validated = contactSchema.parse(contact)
        contacts.push(validated)
      } catch (error) {
        if (error instanceof Error) {
          errors.push(`vCard ${index + 1}: ${error.message}`)
        } else {
          errors.push(`vCard ${index + 1}: Invalid data`)
        }
      }
    })

    return {
      contacts,
      errors,
      totalRows: vcards.length,
      successCount: contacts.length,
    }
  } catch (error) {
    errors.push(
      `Failed to parse vCard: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return {
      contacts: [],
      errors,
      totalRows: 0,
      successCount: 0,
    }
  }
}
