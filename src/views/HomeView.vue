<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Search for a city"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />
      <ul
        v-if="weatherApiSearchResults.length > 0"
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
      >
        <li
          v-for="searchResult in weatherApiSearchResults"
          :key="searchResult.id"
          class="py-2 cursor-pointer"
          @click="previewCity(searchResult.name)"
        >
          {{ searchResult.name }}, {{ searchResult.country }}
        </li>
      </ul>
    </div>
  </main>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface SearchResultProps {
  country: string
  id: number
  lat: number
  lon: number
  name: string
  region: string
  url: string
}

const searchQuery = ref<String>('')
const queryTimeout = ref<NodeJS.Timeout>()
const weatherApiSearchResults = ref<SearchResultProps[]>([])

const router = useRouter()

const previewCity = (searchResult: string) => {
  // console.log(searchResult)
  router.push({
    name: 'weather',
    params: { city: searchResult }
  })
}

const getSearchResults = () => {
  clearTimeout(queryTimeout.value)
  queryTimeout.value = setTimeout(async () => {
    try {
      if (searchQuery.value !== '') {
        const result = await axios.get(
          `http://api.weatherapi.com/v1/search.json?key=${import.meta.env.VITE_WEATHERAPI_KEY}&q=${searchQuery.value}`
        )
        weatherApiSearchResults.value = result.data
        console.log(weatherApiSearchResults.value)
        return
      }
      weatherApiSearchResults.value = []
    } catch (error) {
      console.log(error)
      throw error
    }
  }, 300)
}
</script>

<style scoped></style>
