<template>
  <header class="sticky top-0 bg-weather-primary shadow-lg">
    <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">
      <RouterLink :to="{ name: 'home' }">
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-sun text-2xl" />
          <p class="text-2xl">The Local Weather</p>
        </div>
      </RouterLink>
      <div class="flex gap-3 flex-1 justify-end">
        <i
          class="fa-solid fa-circle-info text-xl hover:text-weather-secondary duration-300 cursor-pointer"
          @click="toggleModal"
        ></i>
        <i
          class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-300 cursor-pointer"
          @click="addCity"
          v-show="!isSaved"
        ></i>
      </div>
      <InfoModal :modalActive="modalActive" @close-modal="toggleModal">
        <div class="text-black">
          <h1 class="text-2xl mb-1">About:</h1>
          <p class="mb-4">
            The Local Weather allows you to track the current and future weather of cities of your
            choosing.
          </p>
          <h2 class="text-2xl">How it works:</h2>
          <ol class="list-decimal list-inside mb-4">
            <li>Search for your city by entering the name into the search bar.</li>
            <li>
              Select a city within the results, this will take you to the current weather for your
              selection.
            </li>
            <li>
              Track the city by clicking on the "+" icon in the top right. This will save the city
              to view at a later time on the home page.
            </li>
          </ol>

          <h2 class="text-2xl">Removing a city</h2>
          <p>
            If you no longer wish to track a city, simply select the city within the home page. At
            the bottom of the page, there will be am option to delete the city.
          </p>
        </div>
      </InfoModal>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import InfoModal from './InfoModal.vue'
import { ref, watch } from 'vue'

interface CityProps {
  name: string
}

const route = useRoute()
const isSaved = ref(false)
const modalActive = ref(false)

watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    if (localStorage.getItem('savedCities')) {
      const savedCities = await JSON.parse(localStorage.getItem('savedCities')!)
      if (savedCities.some((city: { name: string }) => city.name === route.params.city)) {
        isSaved.value = true
      }
    }
  }
)

const toggleModal = () => {
  modalActive.value = !modalActive.value
}

const savedCities = ref<Array<CityProps>>([])

const addCity = () => {
  if (localStorage.getItem('savedCities')) {
    savedCities.value = JSON.parse(localStorage.getItem('savedCities')!)
  }
  const locationObject = {
    name: route.params.city as string
  }
  if (!savedCities.value.some((city: { name: string }) => city.name === route.params.city)) {
    savedCities.value.push(locationObject)
    localStorage.setItem('savedCities', JSON.stringify(savedCities.value))
    isSaved.value = true
  }
}
</script>
