<template>
  <section class="blog-detalhe" v-if="post">
    <img
      v-if="post.imagem_url"
      :src="post.imagem_url"
      alt="Imagem do post"
      class="blog-image"
    />

    <h2>{{ post.titulo }}</h2>
    <p class="data">{{ formatarData(post.data_criacao) }}</p>
    <p class="conteudo">{{ post.conteudo }}</p>

    <router-link to="/blog">
      <button class="voltar">← Voltar ao blog</button>
    </router-link>
  </section>
  <section class="blog-detalhe" v-else>
    <p>Post não encontrado.</p>
    <router-link to="/blog">
      <button class="voltar">← Voltar</button>
    </router-link>
  </section>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import api from "../services/api";

onMounted(buscarPost);

const route = useRoute();
const id = route.params.id;
const carregando = ref(false);
const post = ref(null);

async function buscarPost() {
  try {
    carregando.value = true;
    const res = await api.get("/blog/" + id);
    post.value = res.data;
  } catch (e) {
    console.error("Erro ao buscar post", e);
  } finally {
    carregando.value = false;
  }
}

const formatarData = (dataISO) => {
  const data = new Date(dataISO);
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${mes}/${ano}`;
};
</script>

<style scoped>
.data {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 2rem;
}

.conteudo {
  line-height: 1.6;
  font-size: 1.1rem;
  color: #333;
  white-space: pre-line;
  text-align: justify;
}

.voltar {
  margin-top: 2rem;
  background-color: #b095dc;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
}

.voltar:hover {
  background-color: #9a82d0;
}

.blog-image {
  max-width: 400px;
  width: 100%;
  display: block;
  margin: 0 auto 1.5rem auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>
