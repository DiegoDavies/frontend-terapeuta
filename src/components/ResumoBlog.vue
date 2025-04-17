<template>
  <section class="resumo-blog">
    <h2>Blog</h2>

    <Swiper
      :slides-per-view="3"
      :space-between="30"
      :navigation="true"
      :breakpoints="swiperBreakpoints"
      class="resumo-swiper"
    >
      <SwiperSlide v-for="post in posts" :key="post.id">
        <div class="card">
          <img
            v-if="post.imagem_url"
            :src="post.imagem_url"
            alt="Imagem do post"
            class="card-image"
          />
          <h3 class="card-title">{{ post.titulo }}</h3>

          <router-link :to="`/blog/${post.id}`">
            <button class="card-button">Acessar Conteúdo</button>
          </router-link>
        </div>
      </SwiperSlide>
    </Swiper>
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

const posts = ref([]);
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

onMounted(async () => {
  const res = await api.get("/recentes");
  posts.value = res.data;
});
</script>

<style scoped>
.resumo-swiper {
  position: relative;
  padding: 0 3rem;
}

.card {
  flex-shrink: 0;
  width: 100%;
  max-width: 260px;
  height: 420px;
  box-shadow: 0 0 0 transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-image {
  max-width: 100%;
  height: 200px;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.card-title {
  margin-bottom: auto;
  text-align: left;
  font-size: 1rem;
  font-weight: bold;
  width: 100%;
}

.card-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #b197d6;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.card-button:hover {
  background-color: #9c7ec2;
}

@media (max-width: 768px) {
  .card {
    width: auto;
    max-width: max-content;
  }
}
</style>
