import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImportDialog } from '@/components/import-export/ImportDialog'
import { ExportDialog } from '@/components/import-export/ExportDialog'

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const search = searchParams.search || ''

  const contacts = await prisma.contact.findMany({
    where: {
      userId: session.user.id,
      ...(search && {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
    },
    orderBy: { firstName: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Contacts</h2>
        <div className="flex gap-2">
          <ImportDialog />
          <ExportDialog />
          <Link href="/contacts/new">
            <Button>Add Contact</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex gap-2">
            <input
              type="search"
              name="search"
              placeholder="Search by name, email, or phone..."
              defaultValue={search}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            />
            <Button type="submit">Search</Button>
            {search && (
              <Link href="/contacts">
                <Button variant="outline">Clear</Button>
              </Link>
            )}
          </form>
        </CardContent>
      </Card>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {search
                  ? 'No contacts found matching your search.'
                  : "You don't have any contacts yet."}
              </p>
              {!search && (
                <Link href="/contacts/new">
                  <Button>Add Your First Contact</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {contact.firstName} {contact.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {contact.email && (
                  <p className="text-sm text-gray-600">{contact.email}</p>
                )}
                {contact.phone && (
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                )}
                {contact.city && contact.state && (
                  <p className="text-sm text-gray-600">
                    {contact.city}, {contact.state}
                  </p>
                )}
                <div className="pt-4">
                  <Link href={`/contacts/${contact.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {contacts.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
