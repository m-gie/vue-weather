<template>
  <div class="flex flex-col flex-1 items-center">
    <div
      class="text-white p-4 bg-weather-secondary w-full flex flex-wrap justify-center flex-1 items-center"
      v-if="!isSaved"
    >
      Press the <span class="text-2xl px-2">+</span> button to add the city to your favourites.
    </div>
    <div v-if="weatherForecastResults !== null" class="flex flex-col items-center text-white py-12">
      <h1 class="text-4xl mb-2">
        {{ weatherForecastResults.location.name }}, {{ weatherForecastResults.location.country }}
      </h1>
      <p class="text-sm">Data last updated at: {{ weatherForecastResults.current.last_updated }}</p>
      <p class="text-8xl mt-12">{{ weatherForecastResults.current.temp_c }}°C</p>
      <p class="text-sm">Feels like: {{ weatherForecastResults.current.feelslike_c }}°C</p>
      <div class="mt-6 flex flex-wrap items-center h-32">
        <img
          :src="`${weatherForecastResults.current.condition.icon}`"
          alt="weather icon"
          width="128"
        />
        {{ weatherForecastResults.current.condition.text }}
      </div>
    </div>
    <hr class="border border-white w-full border-opacity-25" />
    <div v-if="weatherForecastResults !== null" class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Today, hourly weather</h2>
        <div class="flex gap-5 overflow-x-auto">
          <div
            v-bind:key="hourData.time_epoch"
            v-for="hourData in todayHours"
            class="flex flex-col gap-2 items-center"
          >
            <p>{{ hourData.time.split(' ')[1] }}</p>
            <div class="w-[64px] h-[64px]">
              <img :src="`${hourData.condition.icon}`" alt="weather icon" />
            </div>
            <p class="text-xs">
              <i class="fa-solid fa-cloud-rain"></i> {{ hourData.chance_of_rain }}%
            </p>
            <p class="text-xs">{{ hourData.temp_c }}°C</p>
          </div>
        </div>
      </div>
    </div>
    <hr class="border border-white w-full border-opacity-25" />
    <div v-if="weatherForecastResults !== null" class="max-w-screen-md w-full pt-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">Three day forecast</h2>
        <div class="flex gap-5 overflow-x-auto">
          <div
            v-bind:key="dayData.date_epoch"
            v-for="dayData in weatherForecastResults.forecast.forecastday"
            @click="setForecastDayData(dayData)"
          >
            <div
              :class="`flex flex-col gap-2 items-center ${forecastDayData?.date === dayData.date ? 'bg-weather-secondary rounded-lg' : ''}`"
            >
              <p>{{ dayData.date }}</p>
              <div class="w-[96px] h-[96px] flex items-center justify-center">
                <img :src="`${dayData.day.condition.icon}`" alt="weather icon" width="96" />
              </div>
              <p><i class="fa-solid fa-cloud-rain"></i> {{ dayData.day.daily_chance_of_rain }}%</p>
              <p>{{ dayData.day.avgtemp_c }}°C</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="hourForecastDay" v-if="forecastDayData !== null" class="max-w-screen-md w-full py-12">
      <div class="mx-8 text-white">
        <h2 class="mb-4">{{ forecastDayData.date }}, hourly weather</h2>
        <div class="flex gap-5 overflow-x-auto">
          <div
            v-bind:key="hourData.time_epoch"
            v-for="hourData in forecastDayData.hour"
            class="flex flex-col gap-2 items-center"
          >
            <p>{{ hourData.time.split(' ')[1] }}</p>
            <div class="w-[64px] h-[64px]">
              <img :src="`${hourData.condition.icon}`" alt="weather icon" />
            </div>
            <p class="text-xs">
              <i class="fa-solid fa-cloud-rain"></i> {{ hourData.chance_of_rain }}%
            </p>
            <p class="text-xs">{{ hourData.temp_c }}°C</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'

interface ForecastHourProps {
  time_epoch: number
  time: string
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
  wind_dir: 'S'
  pressure_mb: number
  pressure_in: number
  precip_mm: number
  precip_in: number
  snow_cm: number
  humidity: number
  cloud: number
  feelslike_c: number
  feelslike_f: number
  windchill_c: number
  windchill_f: number
  heatindex_c: number
  heatindex_f: number
  dewpoint_c: number
  dewpoint_f: number
  will_it_rain: number
  chance_of_rain: number
  will_it_snow: number
  chance_of_snow: number
  vis_km: number
  vis_miles: number
  gust_mph: number
  gust_kph: number
  uv: number
}

interface ForecastDayProps {
  date: string
  date_epoch: number
  day: {
    maxtemp_c: number
    maxtemp_f: number
    mintemp_c: number
    mintemp_f: number
    avgtemp_c: number
    avgtemp_f: number
    maxwind_mph: number
    maxwind_kph: number
    totalprecip_mm: number
    totalprecip_in: number
    totalsnow_cm: number
    avgvis_km: number
    avgvis_miles: number
    avghumidity: number
    daily_will_it_rain: number
    daily_chance_of_rain: number
    daily_will_it_snow: number
    daily_chance_of_snow: number
    condition: {
      text: string
      icon: string
      code: number
    }
    uv: number
  }
  astro: {
    sunrise: string
    sunset: string
    moonrise: string
    moonset: string
    moon_phase: string
    moon_illumination: number
    is_moon_up: number
    is_sun_up: number
  }
  hour: Array<ForecastHourProps>
}

interface WeatherForecastProps {
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
  forecast: {
    forecastday: Array<ForecastDayProps>
  }
}

const route = useRoute()

const weatherForecastResults = ref<WeatherForecastProps | null>(null)
const todayHours = ref<ForecastHourProps[] | null>(null)
const forecastDayData = ref<ForecastDayProps | null>(null)
const isSaved = ref(false)

const checkSavedCities = async () => {
  if (localStorage.getItem('savedCities')) {
    const savedCities = await JSON.parse(localStorage.getItem('savedCities')!)
    if (savedCities.some((city: { name: string }) => city.name === route.params.city)) {
      isSaved.value = true
    }
  }
}
checkSavedCities()

const setForecastDayData = async (dayData: ForecastDayProps) => {
  forecastDayData.value = dayData
  await nextTick()
  const hourForecastDiv = document.getElementById('hourForecastDay')
  hourForecastDiv!.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
}

const getWeatherForecast = async () => {
  try {
    const weatherForecast = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHERAPI_KEY}&q=${route.params.city}&days=3`
    )
    weatherForecastResults.value = weatherForecast.data
    todayHours.value = weatherForecastResults.value!.forecast.forecastday[0].hour.filter(
      (hourObject) => hourObject.time_epoch * 1000 > Date.now() - 3600000
    )
  } catch (error) {
    console.log(error)
    throw error
  }
}

await getWeatherForecast()
</script>
