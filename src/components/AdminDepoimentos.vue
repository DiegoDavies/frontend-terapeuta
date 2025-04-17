<template>
  <section class="admin-bloco">
    <h3>Gerenciar Depoimentos</h3>

    <div v-if="carregando">Carregando depoimentos...</div>
    <ul v-else class="lista-depoimentos">
      <li v-for="depoimento in depoimentos" :key="depoimento.id">
        <p class="texto">"{{ depoimento.mensagem }}"</p>
        <p class="autor">— {{ depoimento.iniciais }}</p>

        <div class="acoes">
          <button v-if="!depoimento.aprovado" @click="aprovar(depoimento.id)">
            Aprovar
          </button>
          <button class="excluir" @click="excluir(depoimento.id)">
            Excluir
          </button>
        </div>

        <span v-if="depoimento.aprovado" class="badge">Aprovado</span>
      </li>
    </ul>

    <p v-if="mensagem" class="sucesso">{{ mensagem }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const depoimentos = ref([]);
const carregando = ref(false);
const salvo = ref(false);
const mensagem = ref("");

onMounted(buscarDepoimentos);

async function buscarDepoimentos() {
  try {
    carregando.value = true;
    const res = await api.get("/admin/depoimentos");
    depoimentos.value = res.data;
  } catch (e) {
    console.error("Erro ao buscar depoimentos", e);
  } finally {
    carregando.value = false;
  }
}

const aprovar = async (id) => {
  const dep = depoimentos.value.find((d) => d.id === id);
  if (dep) dep.aprovado = true;
  try {
    await api.patch(`/admin/depoimentos/${id}/aprovar`);
    mensagem.value = "Depoimento aprovado com sucesso!";
  } catch (e) {
    console.error("Erro ao aprovar depoimento", e);
  }
};

const excluir = async (id) => {
  try {
    await api.delete(`/admin/depoimentos/${id}`);
    mensagem.value = "Depoimento removido com sucesso!";
    depoimentos.value = depoimentos.value.filter((p) => p.id !== id);
  } catch (e) {
    console.error("Erro ao excluir depoimento", e);
  }
};
</script>

<style scoped>
.lista-depoimentos {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.lista-depoimentos li {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  background-color: #fff;
}

.texto {
  font-style: italic;
  color: #444;
  margin-bottom: 0.5rem;
}

.autor {
  font-weight: bold;
  color: #666;
}

.acoes {
  margin-top: 0.5rem;
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  background-color: #b095dc;
}

button.excluir {
  background-color: #f44336;
}

.badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #4caf50;
  color: white;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  border-radius: 4px;
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
