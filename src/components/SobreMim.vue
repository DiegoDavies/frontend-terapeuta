<template>
  <section class="sobre-mim">
    <h2>Sobre Mim</h2>
    <div class="conteudo">
      <p>{{ config.sobremim }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const config = ref({})

onMounted(async () => {
  const { data } = await api.get('/config')
  data.forEach(item => {
    config.value[item.campo] = item.campo === 'whatsapp'
      ? item.valor.replace(/\D/g, '')
      : item.valor;
  })
})
</script>


<style scoped>
.sobre-mim .conteudo {
  max-width: 800px;
  margin: 0 auto;
}

.sobre-mim p {
  white-space: pre-line;
}
</style>