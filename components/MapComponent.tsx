'use client'

import { useEffect } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface MapComponentProps {
  locations: { lat: number; lng: number; name: string }[]
}

const MapComponent: React.FC<MapComponentProps> = ({ locations }) => {
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: 'weekly',
    })

    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: locations[0].lat, lng: locations[0].lng },
        zoom: 12,
      })

      locations.forEach((location) => {
        new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: map,
          title: location.name,
        })
      })
    })
  }, [locations])

  return <div id="map" className="w-full h-96 rounded-lg shadow-md" />
}

export default MapComponent

