import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const contactCount = await prisma.contact.count({
    where: { userId: session.user.id },
  })

  const recentContacts = await prisma.contact.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">
          Welcome back, {session.user.name || session.user.email}!
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your contacts and stay organized
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Contacts</CardTitle>
            <CardDescription>Your address book</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{contactCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your contacts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/contacts/new">
              <Button className="w-full">Add Contact</Button>
            </Link>
            <Link href="/contacts">
              <Button variant="outline" className="w-full">
                View All Contacts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {recentContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>Your latest additions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                  <Link href={`/contacts/${contact.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
