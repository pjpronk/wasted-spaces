<template>
  <DefaultMapLayout
    v-if="resolvedLocation"
    :center="resolvedLocation"
    :zoom="13"
  />
</template>

<script setup lang="ts">
import type { GeoPoint } from "@firebase/firestore"

const route = useRoute()
const { resolveLocation } = useLocationResolver()
const { google, isLoading } = useGoogleMaps()

const resolvedLocation = ref<GeoPoint | null>(null)

// Wait for Google Maps to load, then resolve the location
watch(
  isLoading,
  async (loading) => {
    if (!loading && google.value) {
      const locationName = route.params.location as string
      if (locationName) {
        const location = await resolveLocation(locationName)
        if (location) {
          resolvedLocation.value = location
        }
      }
    }
  },
  { immediate: true }
)
</script>
