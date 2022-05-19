<template>
  <nav>
    <header class="w3-container w3-row-padding w3-card-4">
      <img
        class="logo w3-animate-fading w3-col l3 w3-center"
        alt=" logo"
        src="./assets/social-media.png"
      />
      <img
        class="logo w3-animate-fading w3-col l3 w3-right"
        alt=" logo"
        src="./assets/logoReseau.png"
      />
      <!-- <img
        class="logo w3-animate-fading w3-col l4 w3-center"
        alt=" logo"
        src="./assets/reseau.png"
      /> -->
    </header>

    <router-link to="/Home/"> Home</router-link>

    | <router-link to="/Connexion">Connexion</router-link> |

    <router-link to="/">Profil</router-link> |
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
  color: #ffffff;
}
a {
  opacity: 0.8;
  text-decoration: none;
  color: #ffffff;
}
.router-link-active {
  font-weight: bold;
  color: rgb(162, 68, 249);
}

a:hover {
  opacity: 1;
  font-weight: bold;
}
/* .logo {
  max-width: 22%;
  max-height: 5%;
} */
.fa-thumbs-up {
  color: #0d07cd;
}
.fa-thumbs-down {
  color: #0d07cd;
}
.fa-heart {
  color: #cd0707;
}
</style>
