<template>
  <div class="layout">
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.layout {
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
