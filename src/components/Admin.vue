<template>
  <section class="painel-admin">
    <h2>Painel Administrativo</h2>

    <nav class="menu-admin">
      <button :class="{ active: secao === 'perfil' }" @click="secao = 'perfil'">Perfil</button>
      <button :class="{ active: secao === 'textos' }" @click="secao = 'textos'">Textos da Home</button>
      <button :class="{ active: secao === 'blog' }" @click="secao = 'blog'">Blog</button>
      <button :class="{ active: secao === 'depoimentos' }" @click="secao = 'depoimentos'">Depoimentos</button>
      <button :class="{ active: secao === 'alterarsenha' }" @click="secao = 'alterarsenha'">Alterar Senha</button>
      <button :class="{ hide: master === false, active: secao === 'usuarios' }" @click="secao = 'usuarios'">Usuários</button>
      <button @click="logout">Sair</button>
    </nav>

    <div class="conteudo-admin">
      <AdminPerfil v-if="secao === 'perfil'" />
      <AdminTextos v-if="secao === 'textos'" />
      <AdminBlog v-if="secao === 'blog'" />
      <AdminDepoimentos v-if="secao === 'depoimentos'" />
      <AdminAlterarSenha v-if="secao === 'alterarsenha'" />
      <AdminUsers v-if="secao === 'usuarios'" />
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import AdminPerfil from "./AdminPerfil.vue";
import AdminTextos from "./AdminTextos.vue";
import AdminBlog from "./AdminBlog.vue";
import AdminDepoimentos from "./AdminDepoimentos.vue";
import AdminAlterarSenha from "./AdminAlterarSenha.vue";
import AdminUsers from "./AdminUsers.vue";

const secao = ref("perfil");
const router = useRouter();
const master = ref(false);

onMounted(async () => {
  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split('.')[1]));

  master.value = payload.master ?? false;
});

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<style scoped>
.menu-admin {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.menu-admin button {
  padding: 0.6rem 1.2rem;
  border: none;
  background-color: #b095dc;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.menu-admin button:hover {
  background-color: #9a82d0;
}

.menu-admin button.active {
  background-color: #a855f7;
  font-weight: 600;
}

.hide {
  display: none;
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
