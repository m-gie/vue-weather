<template>
  <div class="flex flex-col flex-1 items-center">
    <div class="text-white p-4 bg-weather-secondary w-full">UNGA</div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

interface CurrentWeatherProps {
  location: {
    name: string
    region: string
    country: string
    lat: number
    lon: number
    tz_id: string
    localtime_epoch: number
    localtime: string
  }
  current: {
    last_updated_epoch: number
    last_updated: string
    temp_c: number
    temp_f: number
    is_day: number
    condition: {
      text: string
      icon: string
      code: number
    }
    wind_mph: number
    wind_kph: number
    wind_degree: number
    wind_dir: string
    pressure_mb: number
    pressure_in: number
    precip_mm: number
    precip_in: number
    humidity: number
    cloud: number
    feelslike_c: number
    feelslike_f: number
    vis_km: number
    vis_miles: number
    uv: number
    gust_mph: number
    gust_kph: number
  }
}

const route = useRoute()

const weatherApiResults = ref<CurrentWeatherProps | null>(null)

const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHERAPI_KEY}&q=${route.params.city}`
    )
    weatherApiResults.value = weatherData.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
const weatherData = await getWeatherData()
</script>
