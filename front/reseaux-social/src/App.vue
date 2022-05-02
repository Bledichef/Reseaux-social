<template>
  <nav>
    <header>
      <img class="logo" alt=" logo" src="./assets/logoReseau.png" />
    </header>
    <!-- <img src="./assets/logoReseau.png" /> -->
    <router-link to="/Home/">Home</router-link> |
    <router-link to="/">Connexion</router-link> |

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
  color: #086fd6;
}
a {
  text-decoration: none;
  color: #0d07cd;
}
.router-link-active {
  font-weight: bold;
  color: blueviolet;
}
.logo {
  max-width: 25%;
  max-height: 5%;
}
.fa-thumbs-up {
  color: #0d07cd;
}
.fa-thumbs-down {
  color: #0d07cd;
}
.fa-heart {
  color: #0d07cd;
}
</style>
