<script setup lang="ts">
import Shimmer from "vue3-loading-shimmer";
</script>
<template>
  <div>
    <Shimmer class="whatever" bg-color="#0d1721" shimmerColor="#2d3c50"/>
    <Shimmer class="whatever" bg-color="#0d1721" shimmerColor="#2d3c50"/>
    <Shimmer class="whatever" bg-color="#0d1721" shimmerColor="#2d3c50"/>
  </div>
</template>
<style scoped>
.whatever {
  height: 60px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 0.5rem;
}
</style>