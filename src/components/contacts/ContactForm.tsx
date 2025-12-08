'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createContact, updateContact } from '@/actions/contact.actions'
import type { Contact } from '@prisma/client'

interface ContactFormProps {
  contact?: Contact
  mode: 'create' | 'edit'
}

export function ContactForm({ contact, mode }: ContactFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result =
      mode === 'create'
        ? await createContact(formData)
        : await updateContact(contact!.id, formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            defaultValue={contact?.firstName}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={contact?.lastName || ''}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={contact?.email || ''}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={contact?.phone || ''}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <Input
          id="address"
          name="address"
          type="text"
          defaultValue={contact?.address || ''}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <Input
            id="city"
            name="city"
            type="text"
            defaultValue={contact?.city || ''}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State
          </label>
          <Input
            id="state"
            name="state"
            type="text"
            defaultValue={contact?.state || ''}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="zipCode" className="text-sm font-medium">
            Zip Code
          </label>
          <Input
            id="zipCode"
            name="zipCode"
            type="text"
            defaultValue={contact?.zipCode || ''}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="country" className="text-sm font-medium">
          Country
        </label>
        <Input
          id="country"
          name="country"
          type="text"
          defaultValue={contact?.country || ''}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={contact?.notes || ''}
          disabled={loading}
          className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? mode === 'create'
              ? 'Creating...'
              : 'Saving...'
            : mode === 'create'
            ? 'Create Contact'
            : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
