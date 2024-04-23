<template>
  <div>
    <Suspense>
      <AsyncCityView />
      <template #fallback>
        <div class="flex flex-1 items-center justify-center text-white p-4">Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import AsyncCityView from '../components/AsyncCityView.vue'
</script>
