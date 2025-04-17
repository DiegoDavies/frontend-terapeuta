<template>
  <section class="admin-bloco">
    <h3>Textos da Página Inicial</h3>

    <form @submit.prevent="salvar">
      <label>Sobre Mim</label>
      <textarea v-model="textos.sobremim" rows="10" />

      <label>Como funciona</label>
      <textarea v-model="textos.comofunciona" rows="7" />

      <button type="submit">Salvar</button>
    </form>

    <p v-if="salvo" class="sucesso">Salvo com sucesso!</p>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import api from "../services/api";

const textos = ref({
  sobremim: "",
  comofunciona: ""
});

const salvo = ref(false);

// 🧠 Ao iniciar, busca as configs do backend
onMounted(async () => {
  const { data } = await api.get("/config");
  data.forEach((item) => {
    textos.value[item.campo] = item.valor;
  });
});

const salvar = async () => {
  await api.patch("/admin/config", textos.value)
  salvo.value = true;
  setTimeout(() => (salvo.value = false), 3000);
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

input,
textarea {
  padding: 0.6rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
}

button {
  background-color: #b095dc;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem;
  cursor: pointer;
  width: 150px;
}

.sucesso {
  color: green;
  margin-top: 1rem;
}

h1::after,
h2::after,
h3::after {
  content: "";
  display: block;
  width: 60px;
  height: 4px;
  background-color: var(--cor-principal, #4a90e2);
  margin: 0.5rem auto 0;
  border-radius: 4px;
}
</style>
