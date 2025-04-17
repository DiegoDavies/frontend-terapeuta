<template>
  <footer
    style="background: #f2f2f2; color: #555; padding: 1rem; text-align: center"
  >
    <p>
      © 2025 Meu Site. Todos os direitos reservados.
      <router-link to="/login">Administrador</router-link>
    </p>
  </footer>
</template>

<style scoped>
footer a {
  color: #b095dc;
  text-decoration: none;
  font-size: 0.9rem;
}

footer a:hover {
  text-decoration: underline;
}
</style>
