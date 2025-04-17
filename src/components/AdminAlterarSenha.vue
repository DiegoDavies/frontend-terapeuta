<template>
  <section class="admin-alterar">
    <h3>Alterar Senha</h3>

    <form @submit.prevent="salvar">
      <label>Senha Atual</label>
      <input v-model="dados.senhaatual" type="password" required />

      <label>Nova Senha</label>
      <input v-model="dados.novasenha" type="password" required />

      <label>Repetir Nova Senha</label>
      <input v-model="dados.repetirsenha" type="password" required />

      <button type="submit">Salvar</button>
    </form>

    <p v-if="sucesso" class="sucesso">{{ sucesso }}</p>
    <p v-if="erro" class="erro">{{ erro }}</p>
  </section>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";

const dados = ref({
  senhaatual: "",
  novasenha: "",
  repetirsenha: "",
});
const sucesso = ref("");
const erro = ref("");

const salvar = async () => {
  sucesso.value = "";
  erro.value = "";

  if (
    !dados.value.senhaatual ||
    !dados.value.novasenha ||
    !dados.value.repetirsenha
  ) {
    erro.value = "Preencha todos os campos.";
    return;
  }

  if (dados.value.novasenha !== dados.value.repetirsenha) {
    erro.value = "As novas senhas não coincidem.";
    return;
  }

  if (dados.value.novasenha.length < 6) {
    erro.value = "A nova senha deve ter pelo menos 6 caracteres.";
    return;
  }

  try {
    await api.post("/auth/alterar-senha", dados.value);
    sucesso.value = "Senha alterada com sucesso!";
    dados.value.senhaatual =
      dados.value.novasenha =
      dados.value.repetirsenha =
        "";
  } catch (err) {
    erro.value = err.response?.data?.message || "Erro ao alterar a senha.";
  }
};
</script>

<style lang="css" scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.6rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
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

.erro {
  color: red;
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
