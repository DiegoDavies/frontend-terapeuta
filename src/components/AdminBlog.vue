<template>
  <section class="admin-bloco">
    <h3>Gerenciar Publicações do Blog</h3>

    <form @submit.prevent="editando ? salvarEdicao() : criarPost()">
      <label>Título</label>
      <input v-model="post.titulo" type="text" required />

      <label>Resumo</label>
      <textarea
        v-model="post.resumo"
        rows="5"
        maxlength="500"
        required
      ></textarea>

      <label>Conteúdo</label>
      <textarea v-model="post.conteudo" rows="9" required></textarea>

      <label>Imagem do Post</label>
      <input
        type="file"
        id="uploadFile"
        @change="handleFileChange"
        accept="image/png, image/jpeg, image/jpg"
      />

      <div v-if="preview" class="preview">
        <p>Prévia:</p>
        <img :src="preview" width="200" />
      </div>

      <button type="submit">
        {{ editando ? "Salvar Alterações" : "Criar Post" }}
      </button>
      <button type="button" v-if="editando" @click="resetarFormulario">
        Cancelar
      </button>
    </form>

    <p v-if="mensagem" class="sucesso">{{ mensagem }}</p>

    <h4 style="margin-top: 2rem">Posts existentes</h4>
    <div v-if="carregando">Carregando posts...</div>

    <div v-else class="lista-posts">
      <div v-for="p in posts" :key="p.id" class="card-post">
        <div class="topo">
          <strong>{{ p.titulo }}</strong>
          <span class="data">{{ formatarData(p.data_criacao) }}</span>
        </div>
        <p>{{ p.resumo }}</p>
        <div class="botoes">
          <button @click="selecionarPost(p)">Editar</button>
          <button class="danger" @click="excluirPost(p.id)">Excluir</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { HTMLInputElement } from "vue";
import api from "../services/api";

const posts = ref([]);
const post = ref({ titulo: "", resumo: "", conteudo: "" });
const editando = ref(false);
const carregando = ref(false);
const imagem = ref<File | null>(null)
const preview = ref<string | null>(null)
const mensagem = ref("");

onMounted(buscarPosts);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target?.files?.[0]
  if (!file) return

  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg']
  if (!tiposPermitidos.includes(file.type)) {
    alert('Formato inválido. Envie JPG ou PNG.')
    return
  }

  imagem.value = file
  preview.value = URL.createObjectURL(file)
}

async function buscarPosts() {
  try {
    carregando.value = true;
    const res = await api.get("/blog");
    posts.value = res.data;
  } catch (e) {
    console.error("Erro ao buscar posts", e);
  } finally {
    carregando.value = false;
  }
}

async function criarPost() {
  try {
    const res = await api.post("/admin/blog", post.value);
    mensagem.value = "Post criado com sucesso!";
    posts.value.push(res.data);
    const postId = res.data.id;
    salvarImagem(postId);
    resetarFormulario();
  } catch (e) {
    console.error("Erro ao criar post", e);
  }
}

async function salvarImagem(postId) {
  if (imagem.value) {
    const formData = new FormData();
    formData.append("file", imagem.value);
    formData.append("postId", postId);

    await api.post("/upload/blog", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

function selecionarPost(p) {
  resetarFormulario();

  post.value = { ...p };
  editando.value = true;

  if (p.imagem_url) {
    preview.value = p.imagem_url;
    imagem.value = null;
  }
}

async function salvarEdicao() {
  try {
    await api.patch(`/admin/blog/${post.value.id}`, post.value);
    mensagem.value = "Post atualizado com sucesso!";
    salvarImagem(post.value.id);
    buscarPosts();
    resetarFormulario();
  } catch (e) {
    console.error("Erro ao salvar post", e);
  }
}

async function excluirPost(id) {
  try {
    await api.delete(`/admin/blog/${id}`);
    mensagem.value = "Post removido com sucesso!";
    posts.value = posts.value.filter((p) => p.id !== id);
  } catch (e) {
    console.error("Erro ao excluir post", e);
  }
}

function resetarFormulario() {
  post.value = { titulo: "", resumo: "", conteudo: "" };
  imagem.value = null;
  preview.value = null;
  editando.value = false;

  const inputFile = document.getElementById("uploadFile") as HTMLInputElement;
  if (inputFile) inputFile.value = "";
}

const formatarData = (dataISO) => {
  const data = new Date(dataISO);
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${mes}/${ano}`;
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
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
  width: fit-content;
}

button.danger {
  background: #dc6b6b;
}

.excluir {
  background-color: #f44336;
}

.lista-posts {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.lista-posts li {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}

.post-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.acoes {
  display: flex;
  gap: 1rem;
}

.sucesso {
  color: green;
  margin-top: 1rem;
}

.card-post {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #fff;
}

.card-post .topo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.botoes button {
  margin-right: 0.5rem;
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
