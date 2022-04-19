<template>
  <nav>
    <header>
      <img class="logo" alt=" logo" src="./assets/logoReseau.png" />
    </header>
    <!-- <img src="./assets/logoReseau.png" /> -->
    <router-link to="/">Home</router-link> |
    <router-link to="/Connexion">Connexion</router-link> |

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
}
a {
  text-decoration: none;
  color: #087ef5;
}
.router-link-active {
  font-weight: bold;
  color: blueviolet;
}
.logo {
  max-width: 25%;
  max-height: 5%;
}
</style>
