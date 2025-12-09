import { auth, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/layout/Logo'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Logo />
              <nav className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/contacts"
                  className="text-gray-300 hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Contacts
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                {session.user.email}
              </span>
              <form
                action={async () => {
                  'use server'
                  await signOut()
                }}
              >
                <Button variant="outline" size="sm" type="submit">
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
