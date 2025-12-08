import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteContact } from '@/actions/contact.actions'

export default async function ContactDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
  })

  if (!contact || contact.userId !== session.user.id) {
    notFound()
  }

  const contactId = contact.id

  async function handleDelete() {
    'use server'
    await deleteContact(contactId)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">
          {contact.firstName} {contact.lastName}
        </h2>
        <div className="flex gap-2">
          <Link href={`/contacts/${contact.id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <form action={handleDelete}>
            <Button variant="destructive" type="submit">
              Delete
            </Button>
          </form>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contact.email && (
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base">
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.email}
                </a>
              </p>
            </div>
          )}

          {contact.phone && (
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-base">
                <a
                  href={`tel:${contact.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.phone}
                </a>
              </p>
            </div>
          )}

          {(contact.address || contact.city || contact.state || contact.zipCode || contact.country) && (
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <div className="text-base">
                {contact.address && <p>{contact.address}</p>}
                {(contact.city || contact.state || contact.zipCode) && (
                  <p>
                    {contact.city}
                    {contact.city && contact.state && ', '}
                    {contact.state} {contact.zipCode}
                  </p>
                )}
                {contact.country && <p>{contact.country}</p>}
              </div>
            </div>
          )}

          {contact.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-base whitespace-pre-wrap">{contact.notes}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Created: {new Date(contact.createdAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              Last updated: {new Date(contact.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <Link href="/contacts">
          <Button variant="outline">Back to Contacts</Button>
        </Link>
      </div>
    </div>
  )
}
