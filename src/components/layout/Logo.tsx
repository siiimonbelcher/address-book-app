import Link from 'next/link'

export function Logo({ size = 'default' }: { size?: 'default' | 'large' }) {
  const sizeClasses = size === 'large' ? 'text-3xl' : 'text-xl'

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative">
        {/* Icon: stylized dress/person */}
        <div className="text-2xl">👔</div>
      </div>
      <div className={`font-bold ${sizeClasses}`}>
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Man In A Dress
        </span>
        {' '}
        <span className="text-foreground">Book</span>
      </div>
    </Link>
  )
}
