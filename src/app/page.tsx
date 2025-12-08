import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold mb-4">Address Book</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          A modern cloud-based contact management application
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/login">
            <Button size="lg">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
