import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from 'lucide-react'

interface Barber {
  id: number
  name: string
  distance: string
  rating: number
}

interface BarberListProps {
  barbers: Barber[]
}

const BarberList: React.FC<BarberListProps> = ({ barbers }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {barbers.map((barber) => (
        <Card key={barber.id}>
          <CardHeader>
            <CardTitle>{barber.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Distance: {barber.distance}</p>
            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < barber.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">{barber.rating.toFixed(1)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default BarberList

