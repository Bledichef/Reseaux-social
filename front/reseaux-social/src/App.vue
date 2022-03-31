<template>
  <nav>
    <!-- <img src="./assets/logoReseau.png" /> -->
    <router-link to="/">Home</router-link> |
    <router-link to="/Connexion">Connexion</router-link> |
    <router-link to="/Enregistrer">Enregistrer</router-link> |
    <router-link to="/Profile">Profil</router-link> |
    <!-- <router-link :to="{ name: 'Enregistrer', params: { name: 'Enregistrer' } }" -->
    <!-- >Enregistrer -->
    <!-- </router-link> -->
    <!-- | -->
    <!-- <router-link to="/Profile">Profil </router-link> -->
  </nav>
  <router-view />
</template>
<script>
export default {
  name: "App",
  methods: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
a {
  text-decoration: none;
  color: #087ef5;
}
.router-link-active {
  font-weight: bold;
  color: blueviolet;
}
</style>
