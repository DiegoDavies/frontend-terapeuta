<template>
  <section class="admin-bloco">
    <h3>Gerenciar Usuários</h3>

    <form @submit.prevent="editando ? salvarEdicao() : criarUsuario()">
      <label>Usuário</label>
      <input v-model="user.nome" type="text" required />

      <label>E-mail</label>
      <input v-model="user.email" type="email" required />

      <label>Senha</label>
      <input v-model="user.senha_hash" type="password" :required="!editando" />

      <button type="submit">
        {{ editando ? "Salvar Alterações" : "Criar Usuário" }}
      </button>
      <button type="button" v-if="editando" @click="resetarFormulario">
        Cancelar
      </button>
    </form>

    <p v-if="mensagem" class="sucesso">{{ mensagem }}</p>
    <p v-if="mensagemerro" class="erro">{{ mensagemerro }}</p>

    <h4 style="margin-top: 2rem">Usuários existentes</h4>
    <div v-if="carregando">Carregando Usuários...</div>

    <div v-else class="card-tabela">
      <!-- Cabeçalho -->
      <div class="linha cabecalho">
        <div class="coluna">Nome</div>
        <div class="coluna">Email</div>
        <div class="coluna">Ações</div>
      </div>

      <!-- Linhas de usuários -->
      <div class="linha" v-for="u in users" :key="u.id">
        <div class="coluna">{{ u.nome }}</div>
        <div class="coluna">{{ u.email }}</div>
        <div class="coluna">
          <button @click="selecionarUsuario(u)">Editar</button>
          <button class="danger" @click="excluirUsuario(u.id)">Excluir</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const users = ref([]);
const user = ref({ nome: "", email: "", senha_hash: "" });
const editando = ref(false);
const carregando = ref(false);
const mensagem = ref("");
const mensagemerro = ref("");

onMounted(buscarUsuarios);

async function buscarUsuarios() {
  try {
    carregando.value = true;
    const res = await api.get("/users");
    users.value = res.data;
  } catch (e) {
    console.error("Erro ao buscar usuários", e);
  } finally {
    carregando.value = false;
  }
}

async function criarUsuario() {
  try {
    if (!validarEmail(user.value.email)) {
      alert("E-mail inválido!");
      return;
    }

    const res = await api.post("/users", user.value);
    mensagem.value = "Usuário criado com sucesso!";
    users.value.push(res.data);
    resetarFormulario();
  } catch (e) {
    mensagemerro.value = e.response?.data?.message || "Erro ao criar usuário";
    console.error("Erro ao criar usuário", e);
  }
}

function selecionarUsuario(u) {
  resetarFormulario();

  user.value = { ...u };
  user.value.senha_hash = "";
  editando.value = true;
}

async function salvarEdicao() {
  try {
    if (!validarEmail(user.value.email)) {
      alert("E-mail inválido!");
      return;
    }

    await api.patch(`/users/${user.value.id}`, user.value);
    mensagem.value = "Usuário atualizado com sucesso!";
    buscarUsuarios();
    resetarFormulario();
  } catch (e) {
    mensagemerro.value = e.response?.data?.message || "Erro ao salvar usuário";
    console.error("Erro ao salvar usuário", e);
  }
}

async function excluirUsuario(id) {
  try {
    await api.patch(`/users/${id}/inativar`);
    mensagem.value = "Usuário removido com sucesso!";
    users.value = users.value.filter((u) => u.id !== id);
  } catch (e) {
    mensagemerro.value = e.response?.data?.message || "Erro ao excluir usuário";
    console.error("Erro ao excluir Usuário", e);
  }
}

function resetarFormulario() {
  user.value = { nome: "", email: "", senha_hash: "" };
  editando.value = false;
}

const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

input {
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
  width: fit-content;
}

.card-tabela {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.linha {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.linha:last-child {
  border-bottom: none;
}

.cabecalho {
  font-weight: bold;
  background-color: #e9e9e9;
  border-radius: 6px;
}

.coluna {
  flex: 1;
  padding: 0 0.5rem;
}

.sucesso {
  color: green;
  margin-top: 1rem;
}

.erro {
  color: red;
  margin-top: 1rem;
}

button.danger {
  margin-left: 5px;
  background: #dc6b6b;
}

.excluir {
  background-color: #f44336;
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

@media (max-width: 768px) {
  .card-tabela {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .linha {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    border-radius: 8px;
  }

  .acoes {
    margin-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }
}
</style>
