import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/contacts/ContactForm'

export default async function EditContactPage({
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

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            Edit Contact: {contact.firstName} {contact.lastName}
          </CardTitle>
          <CardDescription>Update contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm contact={contact} mode="edit" />
        </CardContent>
      </Card>
    </div>
  )
}
