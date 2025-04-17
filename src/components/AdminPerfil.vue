<template>
  <section class="admin-bloco">
    <h3>Informações da Terapeuta</h3>

    <form @submit.prevent="salvar">
      <label>Titulo da Pagina</label>
      <input v-model="perfil.titulo_pagina" type="text" />

      <label>Nome</label>
      <input v-model="perfil.nome" type="text" />

      <label>Complemento de informações</label>
      <input v-model="perfil.complemento" type="text" />

      <label>WhatsApp</label>
      <input :value="perfil.whatsapp" @input="formatarWhatsapp" @keypress="permitirSomenteNumeros" inputmode="numeric" maxlength="15" placeholder="(99) 99999-9999" type="text" />

      <label>Email</label>
      <input v-model="perfil.email" type="email" />

      <label>URL da Foto de Perfil</label>
      <input v-model="perfil.foto" type="text" />
      <input type="file" @change="handleFileChange" accept="image/png, image/jpeg, image/jpg" />

      <div class="preview">
        <p>Prévia da foto:</p>
        <img :src="perfil.foto" v-if="perfil.foto" width="140" height="140" />
      </div>

      <button type="submit">Salvar</button>
    </form>

    <p v-if="salvo" class="sucesso">Salvo com sucesso!</p>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import api from "../services/api";

const perfil = ref({
  nome: "",
  complemento: "",
  whatsapp: "",
  email: "",
  foto: "",
});

const salvo = ref(false);

// 🧠 Ao iniciar, busca as configs do backend
onMounted(async () => {
  const { data } = await api.get("/config");
  data.forEach((item) => {
    perfil.value[item.campo] = item.valor;
  });
});

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    alert('Formato inválido. Envie uma imagem JPG ou PNG.')
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await api.post('/upload/perfil', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    perfil.value.foto = res.data.url
  } catch (e) {
    console.error('Erro ao fazer upload:', e)
  }
}

const formatarWhatsapp = (e) => {
  let valor = e.target.value.replace(/\D/g, '');

  if (valor.length > 11) {
    valor = valor.slice(0, 11);
  }

  if (valor.length <= 10) {
    valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }

  perfil.value.whatsapp = valor;
};

const permitirSomenteNumeros = (e) => {
  const codigo = e.charCode ? e.charCode : e.keyCode;
  // Permite apenas dígitos (0-9)
  if (codigo < 48 || codigo > 57) {
    e.preventDefault();
  }
};

const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const salvar = async () => {
  if (!validarEmail(perfil.value.email)) {
    alert("E-mail inválido!");
    return;
  }

  await api.patch("/admin/config", perfil.value);
  salvo.value = true;
  setTimeout(() => (salvo.value = false), 3000);
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
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  background-color: #b095dc;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem;
  cursor: pointer;
  width: 150px;
}

.preview {
  margin-top: 1rem;
}

.preview img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--cor-principal, #38dbf8);
  filter: brightness(1.1) contrast(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  background-color: #fff;
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
