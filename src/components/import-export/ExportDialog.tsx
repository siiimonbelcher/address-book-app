'use client'

import { useState } from 'react'
import { exportContacts } from '@/actions/export.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ExportDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleExport(format: 'csv' | 'vcard') {
    setLoading(true)
    setError(null)

    try {
      const result = await exportContacts(format)

      if (!result.success || !result.content) {
        setError(result.error || 'Export failed')
        setLoading(false)
        return
      }

      // Create a blob and download
      const blob = new Blob([result.content], {
        type: format === 'csv' ? 'text/csv' : 'text/vcard',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setLoading(false)
      setIsOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="outline">
        Export Contacts
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Export Contacts</CardTitle>
          <CardDescription>
            Download your contacts in CSV or vCard format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Choose export format:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleExport('csv')}
                disabled={loading}
                variant="outline"
                className="h-20 flex-col"
              >
                <span className="text-lg font-semibold">CSV</span>
                <span className="text-xs text-gray-500">
                  Excel, Google Sheets
                </span>
              </Button>
              <Button
                onClick={() => handleExport('vcard')}
                disabled={loading}
                variant="outline"
                className="h-20 flex-col"
              >
                <span className="text-lg font-semibold">vCard</span>
                <span className="text-xs text-gray-500">
                  Apple, Gmail, Outlook
                </span>
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsOpen(false)
              setError(null)
            }}
            disabled={loading}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
