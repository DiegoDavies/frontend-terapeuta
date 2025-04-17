<template>
  <header>
    <div class="container">
      <nav style="margin-top: 10px">
        <RouterLink to="/" exact>Início</RouterLink>
        <RouterLink to="/blog">Blog</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
  .container {
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  nav {
    padding: 10px;
    position: sticky;
    top: 0;
    z-index: 1000;
    backdrop-filter: blur(6px);
    justify-content: center;
    display: flex;
    gap: 20px;
  }

  nav a {
    text-decoration: none;
    font-weight: 500;
    color: inherit;
  }

  nav a:hover, nav a.active-link {
    font-weight: bold;
    border-bottom: 2px solid var(--cor-principal, #38dbf8);
  }
</style>