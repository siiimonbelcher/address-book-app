import type { Contact } from '@prisma/client'

export function generateVCard(contacts: Contact[]): string {
  const vcards = contacts.map((contact) => {
    const lines: string[] = []

    lines.push('BEGIN:VCARD')
    lines.push('VERSION:3.0')

    // FN (Full Name)
    const fullName = `${contact.firstName} ${contact.lastName || ''}`.trim()
    lines.push(`FN:${fullName}`)

    // N (Structured Name) - Family;Given;Additional;Prefix;Suffix
    lines.push(`N:${contact.lastName || ''};${contact.firstName};;;`)

    // EMAIL
    if (contact.email) {
      lines.push(`EMAIL;TYPE=INTERNET:${contact.email}`)
    }

    // TEL (Phone)
    if (contact.phone) {
      lines.push(`TEL;TYPE=CELL:${contact.phone}`)
    }

    // ADR (Address) - ;;Street;City;State;Postal;Country
    if (contact.address || contact.city || contact.state || contact.zipCode || contact.country) {
      const adr = [
        '', // PO Box
        '', // Extended address
        contact.address || '',
        contact.city || '',
        contact.state || '',
        contact.zipCode || '',
        contact.country || '',
      ].join(';')
      lines.push(`ADR;TYPE=HOME:${adr}`)
    }

    // NOTE
    if (contact.notes) {
      // Escape special characters in notes
      const escapedNotes = contact.notes.replace(/\n/g, '\\n').replace(/,/g, '\\,')
      lines.push(`NOTE:${escapedNotes}`)
    }

    // REV (Revision timestamp)
    const revDate = new Date(contact.updatedAt).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    lines.push(`REV:${revDate}`)

    lines.push('END:VCARD')

    return lines.join('\r\n')
  })

  return vcards.join('\r\n\r\n')
}
