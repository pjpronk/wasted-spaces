<template>
  <div class="location-info-window">
    <div class="image-container">
      <a 
        :href="googleMapsStreetViewUrl" 
        target="_blank" 
        rel="noopener noreferrer"
        class="image-link"
      >
        <BaseImage
          :image="streetViewUrl"
          alt="Location Street View"
          class="location-image"
        />
      </a>
      <div class="tags-container">
        <BaseTag :tag="location.type" />
        <BaseTag :tag="location.ownership" />
      </div>
    </div>
    <LocationHeader :location="location" />
    <div class="buttons mt-0-75">
      <div class="flex-row">
        <BaseButton class="primary" @click="handleUpvote">
          <BaseVote :count="location.upvotes || 0" type="upvotes" />
        </BaseButton>
        <BaseButton class="primary" @click="handleDownvote">
          <BaseVote :count="location.downvotes || 0" type="downvotes" />
        </BaseButton>
      </div>
      <div class="flex-row">
        <BaseButton class="primary-inverted" @click.stop="$emit('close')">
          Sluiten
        </BaseButton>
      </div>
    </div>
    <Teleport to="body">
      <Overlay
        v-if="openVoteDialog"
        title="Bevestig of betwist locatie"
        @close="openVoteDialog = false"
      >
        <VoteCreate :location-id="location.id" :vote-type="voteType" />
      </Overlay>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { LocationDetails } from "~/types/types"
import { VoteType } from "~/types/types"


const openVoteDialog = ref(false)
const voteType = ref(VoteType.UPVOTE)

const props = defineProps<{
  location: LocationDetails
}>()

defineEmits<{
  close: []
}>()

const { generateStreetViewUrl, generateGoogleMapsStreetViewUrl } = useGoogleMaps()

const streetViewUrl = computed(() => {
  return generateStreetViewUrl(
    props.location.latLng.latitude,
    props.location.latLng.longitude
  )
})

const googleMapsStreetViewUrl = computed(() => {
  return generateGoogleMapsStreetViewUrl(
    props.location.latLng.latitude,
    props.location.latLng.longitude
  )
})

const handleUpvote = () => {
  voteType.value = VoteType.UPVOTE
  openVoteDialog.value = true
}

const handleDownvote = () => {
  voteType.value = VoteType.DOWNVOTE
  openVoteDialog.value = true
}
</script>

<style scoped lang="scss">
.image-container {
  position: relative;
  width: 100%;
  min-width: 80px;
  height: 200px;

  @include for-tablet-landscape-down {
    height: 150px;
  }
}

.image-link {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
}

.location-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
}

.location-info-window {
  background-color: $white;
  color: $black;
  padding: 12px;
}

.tags-container {
  position: relative;
  padding: 8px;
  display: flex;
  gap: 8px;
}

.flex-row {
  gap: 8px;
}

.buttons {
  display: flex;
  gap: 8px;
  @include for-tablet-landscape-down {
    flex-direction: column;
  }
  .button {
    width: 100%;
  }
}
</style>
