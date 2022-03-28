<template>
  <router-link to="/">Home</router-link> |
  <router-link to="/Connexion">Connexion</router-link> |
  <router-link to="/Enregistrer">Enregistrer </router-link>
  |
</template>
<script>
export default {
  name: "App",
  methods: {
    goToProduct3: function () {
      this.$router.push({ name: "Product", params: { name: "Roller" } });
    },
  },
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
