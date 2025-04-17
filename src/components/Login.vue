<template>
  <section class="login">
    <h2>Login do Administrador</h2>

    <form @submit.prevent="logar">
      <label>Email</label>
      <input v-model="email" type="email" required />

      <label>Senha</label>
      <input v-model="senha" type="password" required />

      <button type="submit">Entrar</button>
    </form>

    <p v-if="erro" class="erro">{{ erro }}</p>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import api from "../services/api";
import { ref } from "vue";
import { useRouter } from "vue-router";

onMounted(() => {
  const isAuth = !!localStorage.getItem("token");
  if (isAuth) {
    router.push("/admin"); // já logado? manda pro painel
  }
});

const router = useRouter();
const email = ref("");
const senha = ref("");
const erro = ref("");

const logar = async () => {
  erro.value = ""
  try {
    const res = await api.post("/auth/login", {
      email: email.value,
      senha: senha.value,
    });
    localStorage.setItem("token", res.data.token);
    router.push("/admin");
  } catch (e) {
    erro.value = "Login inválido";
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

button {
  padding: 0.6rem;
  background-color: #b095dc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.erro {
  color: red;
  margin-top: 1rem;
}
</style>
