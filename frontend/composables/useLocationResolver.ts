import { GeoPoint } from "@firebase/firestore"

export const useLocationResolver = () => {
  const { google } = useGoogleMaps()

  const resolveLocation = async (locationName: string): Promise<GeoPoint | null> => {
    if (!locationName || !locationName.trim()) {
      return null
    }

    if (!google.value) {
      console.error('Google Maps API not loaded')
      return null
    }

    try {
      const geocoder = new google.value.maps.Geocoder()
      
      return new Promise((resolve) => {
        geocoder.geocode(
          { address: locationName, region: 'nl' },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location
              const latLng = new GeoPoint(location.lat(), location.lng())
              resolve(latLng)
            } else {
              console.error(`Could not find location: ${locationName}`)
              resolve(null)
            }
          }
        )
      })

    } catch (err) {
      console.error('Error resolving location:', err)
      return null
    }
  }

  return {
    resolveLocation
  }
}