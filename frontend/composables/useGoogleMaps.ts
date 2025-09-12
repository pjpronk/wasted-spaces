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

  return {
    google: readonly(googleConfig),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadGoogleMaps
  }
}
