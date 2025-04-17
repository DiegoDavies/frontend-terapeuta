<template>
  <section>
    <h2>Depoimentos</h2>

    <router-link to="/depoimentos">
      <button>Deixe seu Depoimento</button>
    </router-link>

    <div class="depoimentos">
      <div v-if="carregando">Carregando depoimentos...</div>
      <Swiper
        v-else
        :slides-per-view="3"
        :space-between="30"
        :navigation="true"
        :breakpoints="swiperBreakpoints"
        class="resumo-swiper"
      >
        <SwiperSlide v-for="item in depoimentos" :key="item.id">
          <div class="card">
            <p class="texto">{{ item.mensagem }}</p>
            <p class="autor">
              {{ item.iniciais }} - {{ formatarData(item.data_envio) }}
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import SwiperCore, { Navigation } from "swiper";
import api from "../services/api";

SwiperCore.use([Navigation]);

const depoimentos = ref([]);
const carregando = ref(false);
const swiperBreakpoints = {
  0: {
    slidesPerView: 1,
    spaceBetween: 16,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 30,
  },
};

onMounted(buscarDepoimentos);

async function buscarDepoimentos() {
  try {
    carregando.value = true;
    const res = await api.get("/depoimentos");
    depoimentos.value = res.data;
  } catch (e) {
    console.error("Erro ao buscar depoimentos", e);
  } finally {
    carregando.value = false;
  }
}

const formatarData = (dataISO) => {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};
</script>

<style scoped>
.resumo-swiper {
  position: relative;
  padding: 0 3rem;
}

div.depoimentos {
  margin-top: 10px;
}

.card {
  flex-shrink: 0;
  width: 100%;
  max-width: 240px;
  scroll-snap-align: center;
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}

.texto {
  margin-bottom: 1rem;
  font-style: italic;
  color: #333;
}

.autor {
  font-weight: bold;
  color: #555;
}

.seta {
  font-size: 1.5rem;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
}

.seta:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .card {
    max-width: 98%;
  }
}
</style>
