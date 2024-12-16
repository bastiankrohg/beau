'use client'

import { useState } from 'react'
import ToggleSwitch from '../components/ToggleSwitch'
import MapComponent from '../components/MapComponent'
import BarberList from '../components/BarberList'

const salonLocations = [
  { lat: 40.7128, lng: -74.0060, name: 'New York Salon' },
  { lat: 34.0522, lng: -118.2437, name: 'Los Angeles Salon' },
  { lat: 41.8781, lng: -87.6298, name: 'Chicago Salon' },
]

const barbers = [
  { id: 1, name: 'John Doe', distance: '0.5 miles', rating: 4.8 },
  { id: 2, name: 'Jane Smith', distance: '1.2 miles', rating: 4.5 },
  { id: 3, name: 'Mike Johnson', distance: '2.0 miles', rating: 4.9 },
]

export default function Booking() {
  const [isAtHome, setIsAtHome] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Book Your Service</h1>
      <div className="mb-8 flex justify-center">
        <ToggleSwitch
          onToggle={(checked) => setIsAtHome(checked)}
          label={isAtHome ? 'At-Home Service' : 'Salon Service'}
        />
      </div>
      {isAtHome ? (
        <BarberList barbers={barbers} />
      ) : (
        <MapComponent locations={salonLocations} />
      )}
    </div>
  )
}

