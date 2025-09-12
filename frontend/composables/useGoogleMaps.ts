import { Loader } from "@googlemaps/js-api-loader"

export const useGoogleMaps = () => {
  const config = useRuntimeConfig()
  const googleConfig: Ref<null | typeof google> = ref(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const loadGoogleMaps = async () => {
    try {
      isLoading.value = true
      error.value = null

      googleConfig.value = await new Loader({
        libraries: ["places", "marker"],
        apiKey: config.public.GOOGLE_MAPS_API_KEY
      }).load()

      isLoading.value = false
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load Google Maps"
      isLoading.value = false
    }
  }

  onMounted(() => {
    loadGoogleMaps()
  })

  const generateStreetViewUrl = (latitude: number, longitude: number, size = "600x400") => {
    const baseUrl = "https://maps.googleapis.com/maps/api/streetview"
    const location = `${latitude},${longitude}`
    
    const params = new URLSearchParams({
      size,
      key: config.public.GOOGLE_MAPS_API_KEY,
      location
    })
    
    return `${baseUrl}?${params.toString()}`
  }

  const generateGoogleMapsStreetViewUrl = (latitude: number, longitude: number) => {
    const baseUrl = "https://www.google.com/maps"
    const location = `${latitude},${longitude}`
    
    const params = new URLSearchParams({
      q: location,
    })
    
    return `${baseUrl}?${params.toString()}`
  }

  return {
    google: readonly(googleConfig),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadGoogleMaps,
    generateStreetViewUrl,
    generateGoogleMapsStreetViewUrl
  }
}
