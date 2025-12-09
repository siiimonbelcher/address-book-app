'use client'

import { useState } from 'react'
import { importContacts } from '@/actions/import.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ImportDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setResult(null)

    const res = await importContacts(formData)
    setResult(res)
    setLoading(false)

    if (res.success) {
      setTimeout(() => {
        setIsOpen(false)
        setResult(null)
      }, 3000)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="outline">
        Import Contacts
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Import Contacts</CardTitle>
          <CardDescription>
            Upload a CSV or vCard file to import contacts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result && (
            <div
              className={`px-4 py-3 rounded ${
                result.success
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {result.success ? (
                <div>
                  <p className="font-medium">
                    Successfully imported {result.imported} contact
                    {result.imported !== 1 ? 's' : ''}
                  </p>
                  {result.errors && result.errors.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm">
                        {result.errors.length} warning(s)
                      </summary>
                      <ul className="list-disc list-inside mt-1 text-xs">
                        {result.errors.slice(0, 5).map((err: string, i: number) => (
                          <li key={i}>{err}</li>
                        ))}
                        {result.errors.length > 5 && (
                          <li>... and {result.errors.length - 5} more</li>
                        )}
                      </ul>
                    </details>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-medium">{result.error}</p>
                  {result.details && result.details.length > 0 && (
                    <ul className="list-disc list-inside mt-2 text-sm">
                      {result.details.slice(0, 3).map((err: string, i: number) => (
                        <li key={i}>{err}</li>
                      ))}
                      {result.details.length > 3 && (
                        <li>... and {result.details.length - 3} more</li>
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="file" className="block text-sm font-medium mb-2">
                Choose file
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept=".csv,.vcf,.vcard,text/csv,text/vcard"
                required
                disabled={loading}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark"
              />
              <p className="mt-1 text-xs text-gray-500">
                CSV or vCard (.vcf) file, max 5MB
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Importing...' : 'Import'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  setResult(null)
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
