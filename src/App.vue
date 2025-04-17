<template>
  <div class="layout">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1; /* 👈 isso empurra o footer pra baixo */
}
</style>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from './services/api'

const config = ref({})
const route = useRoute()

onMounted(async () => {
  const { data } = await api.get('/config')
  data.forEach((item) => {
    config.value[item.campo] = item.valor
  })

  atualizarTitulo()
})

watch(() => route.path, atualizarTitulo)

function atualizarTitulo() {
  if (config.value.titulo_pagina) {
    document.title = config.value.titulo_pagina
  }
}
</script>