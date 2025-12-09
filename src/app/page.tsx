import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-background via-card to-background">
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-6xl">👔</div>
          <div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Man In A Dress
            </h1>
            <h2 className="text-4xl font-semibold text-foreground">Book</h2>
          </div>
        </div>

        <p className="text-xl text-gray-400 max-w-2xl">
          A modern cloud-based contact management application
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
