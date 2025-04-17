<template>
  <section class="formulario">
    <h2>Deixe seu depoimento</h2>
    <form @submit.prevent="salvarEdicao">
      <div>
        <label>Suas iniciais</label>
        <input
          v-model="depoimento.iniciais"
          class="nome"
          type="text"
          maxlength="10"
          required
        />
      </div>
      <div>
        <label>Escreva seu depoimento</label>
        <textarea
          v-model="depoimento.mensagem"
          rows="2"
          class="text-depoimento"
        ></textarea>
      </div>
      <button type="submit" :disabled="carregando">
        <span v-if="!carregando">Enviar</span>
        <span v-else class="spinner"></span>
      </button>
    </form>

    <p v-if="mensagem" class="sucesso">
      Obrigado! Seu depoimento será avaliado.
    </p>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const depoimento = ref({ iniciais: "", mensagem: "" });
const mensagem = ref("");
const carregando = ref(false);

async function salvarEdicao() {
  try {
    carregando.value = true;
    await api.post("/depoimentos", depoimento.value);
    mensagem.value = "Obrigado! Seu depoimento será avaliado.";
    setTimeout(() => {
      router.push("/");
    }, 1000);
  } catch (e) {
    console.error("Erro ao salvar depoimento", e);
  } finally {
    carregando.value = false;
  }
}
</script>

<style scoped>
label {
  display: block;
  margin: 1.5rem 0 0.5rem;
  font-weight: 500;
  color: #333;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  background: #fff;
}

textarea {
  min-height: 120px;
  max-height: 450px;
  resize: vertical;
}

.sucesso {
  margin-top: 1rem;
  font-weight: 500;
  color: #4caf50;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid #ccc;
  border-top-color: #6b4fbb;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
