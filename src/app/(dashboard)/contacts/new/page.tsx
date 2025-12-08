import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/contacts/ContactForm'

export default function NewContactPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Contact</CardTitle>
          <CardDescription>
            Create a new contact in your address book
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
