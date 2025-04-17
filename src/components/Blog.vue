<template>
  <section class="blog-pagina">
    <h2>Blog</h2>

    <div class="filtros">
      <div>
        <label>Filtrar por titulo ou resumo</label>
        <input v-model="busca" type="text" />
      </div>

      <div>
        <label>Filtrar por Data</label>
        <input v-model="dataFiltro" type="month" />
      </div>
    </div>

    <div v-if="carregando">Carregando posts...</div>
    <div v-else class="posts">
      <div v-for="post in postsFiltrados" :key="post.id" class="card-post">
        <div class="post-card">
          <img :src="post.imagem_url" alt="Imagem do post" class="post-image" />

          <div class="post-content">
            <div class="post-header">
              <h3>{{ post.titulo }}</h3>
              <span class="data">{{ formatarData(post.data_criacao) }}</span>
            </div>
            <p>
              {{
                post.resumo.length > 250
                  ? post.resumo.slice(0, 250) + "..."
                  : post.resumo
              }}
            </p>
          </div>
        </div>
        <router-link :to="`/blog/${post.id}`">
          <button>Ler mais</button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";

onMounted(buscarPosts);

const busca = ref("");
const dataFiltro = ref("");
const carregando = ref(false);
const posts = ref([]);

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

const postsFiltrados = computed(() => {
  return posts.value.filter((post) => {
    const tituloResumo = (post.titulo + post.resumo).toLowerCase();
    const filtroTexto = busca.value.toLowerCase();

    const dataPost = new Date(post.data_criacao);
    const mes = String(dataPost.getMonth() + 1).padStart(2, "0"); // ex: "04"
    const ano = dataPost.getFullYear();
    const dataFormatada = `${ano}-${mes}`; // ex: "04/2025"

    const passaFiltroTexto = tituloResumo.includes(filtroTexto);
    const passaFiltroData =
      !dataFiltro.value || dataFormatada === dataFiltro.value;

    return passaFiltroTexto && passaFiltroData;
  });
});

const formatarData = (dataISO) => {
  const data = new Date(dataISO);
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${mes}/${ano}`;
};
</script>

<style scoped>
.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.filtros > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.filtros label {
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #444;
}

.filtros input {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  height: 40px;
}

.filtros > div:first-child {
  flex: 1;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card-post {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.post-card {
  display: flex;
  gap: 1.5rem;
}

.post-image {
  width: 180px;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
}

.post-content {
  flex: 1;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-post .topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.card-post h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.card-post .data {
  font-size: 0.9rem;
  color: #888;
}

.card-post p {
  margin: 1rem 0;
  color: #555;
  line-height: 1.4;
  text-align: left;
}

.card-post button {
  padding: 0.6rem 1.5rem;
  background: #b095dc;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.card-post button:hover {
  background: #9a82d0;
}

@media (max-width: 768px) {
  .filtros {
    flex-direction: column;
  }

  .filtros > div {
    flex: 1; 
  }

  .post-card {
    flex-direction: column;
  }

  .card-post {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-post img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  .card-post .botao {
    margin-top: auto;
    align-self: flex-start;
  }
}
</style>
