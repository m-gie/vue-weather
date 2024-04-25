<template>
  <div>
    <h2 class="text-4xl">Saved cities</h2>
    <div
      v-bind:key="city.name"
      v-for="city in savedCurrentWeather"
      class="flex flex-row justify-start mt-6 items-center gap-4"
    >
      <RouterLink :to="{ name: 'weather', params: { city: city.name } }">
        <div
          class="flex flex-row justify-between bg-weather-secondary rounded-xl min-w-80 max-w-md items-center px-4"
        >
          <p class="text-2xl">{{ city.name }}</p>
          <img :src="`${city.condition.icon}`" />
          <span class="flex flex-row">
            <p>{{ city.temp_c }}°C ({{ city.feelslike_c }}°C)</p>
          </span>
        </div>
      </RouterLink>

      <button
        class="flex flex-row items-center justify-center bg-weather-secondary rounded-xl max-w-md w-16 h-16 hover:text-red-500"
        @click="removeFromSaved(city.name)"
      >
        <i class="fa-solid fa-trash-can text-2xl"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import type { City } from '@/types/cities'
import { ref } from 'vue'

// const props = defineProps({
//   savedCities: {
//     required: false,
//     type: Array<City>
//   }
// })

interface SavedCurrentWeatherProps {
  name: string
  temp_c: number
  feelslike_c: number
  condition: {
    text: string
    icon: string
    code: number
  }
}

const savedCurrentWeather = ref<SavedCurrentWeatherProps[]>([])
const savedCities = ref<City[]>([])

const getSavedCurrentWeather = async () => {
  // let city: City
  console.log('GET CURRENT WEATHER')
  for (let city of savedCities.value as City[]) {
    try {
      const weatherForecast = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHERAPI_KEY}&q=${city.name}`
      )

      let savedCurrentWeatherObject = {
        name: city.name,
        temp_c: weatherForecast.data.current.temp_c,
        feelslike_c: weatherForecast.data.current.feelslike_c,
        condition: weatherForecast.data.current.condition
      }
      savedCurrentWeather.value.push(savedCurrentWeatherObject)
      console.log('for each saved')
      console.log(savedCurrentWeather.value)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

const checkSavedCities = async () => {
  if (localStorage.getItem('savedCities')) {
    savedCities.value = await JSON.parse(localStorage.getItem('savedCities')!)
    // if (savedCities.some((city: { name: string }) => city.name === route.params.city)) {
    //   isSaved.value = true
    // }
    getSavedCurrentWeather()
  }
}
await checkSavedCities()

const removeFromSaved = async (cityName: string) => {
  if (localStorage.getItem('savedCities')) {
    const localStorageCities = await JSON.parse(localStorage.getItem('savedCities')!)
    const updatedCities = localStorageCities.filter((city: City) => city.name !== cityName)
    localStorage.setItem('savedCities', JSON.stringify(updatedCities))
    savedCities.value = updatedCities
    // checkSavedCities()
    getSavedCurrentWeather()
  }
}
</script>

<style scoped></style>
