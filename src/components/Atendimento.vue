<template>
  <section id="atendimento">
    <h2>Como Funciona o Atendimento</h2>
    <div>
      <p>{{ config.comofunciona }}</p>
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
#atendimento p {
  margin-bottom: 1rem;
  font-size: 1rem;
  white-space: pre-line;
}
</style>