import Link from 'next/link'
import { Button } from "components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          Welcome to <span className="text-blue-600">Le Beau</span>
        </h1>
        <p className="text-xl sm:text-2xl mb-8">
          Book your salon or at-home services with ease
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild>
            <Link href="/booking">Book Now</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

