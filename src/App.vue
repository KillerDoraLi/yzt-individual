<script setup lang="ts"></script>

<template>
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<style>
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  max-width: 100vw;
}
@font-face {
  font-family: 'Glyphicons Halflings';
  src: url('@/styles/fonts/glyphicons-halflings-regular.eot');
  src:
    url('@/styles/fonts/glyphicons-halflings-regular.eot?#iefix')
      format('embedded-opentype'),
    url('@/styles/fonts/glyphicons-halflings-regular.woff2') format('woff2'),
    url('@/styles/fonts/glyphicons-halflings-regular.woff') format('woff'),
    url('@/styles/fonts/glyphicons-halflings-regular.ttf') format('truetype'),
    url('@/styles/fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular')
      format('svg');
}
</style>
