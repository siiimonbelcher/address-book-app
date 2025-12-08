import Papa from 'papaparse'
import type { Contact } from '@prisma/client'

export function generateCSV(contacts: Contact[]): string {
  const data = contacts.map((contact) => ({
    'First Name': contact.firstName,
    'Last Name': contact.lastName || '',
    Email: contact.email || '',
    Phone: contact.phone || '',
    Address: contact.address || '',
    City: contact.city || '',
    State: contact.state || '',
    'Zip Code': contact.zipCode || '',
    Country: contact.country || '',
    Notes: contact.notes || '',
  }))

  return Papa.unparse(data, {
    quotes: true,
    header: true,
  })
}
