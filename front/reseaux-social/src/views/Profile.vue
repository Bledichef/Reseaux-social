<template>
  <h1 class="card__title">Espace Perso</h1>
  <p class="card__subtitle">A propos de vous</p>
  <p class="card_user">{{ user.email }} {{ user.username }} {{ user.job }}</p>

  <div class="form-row">
    <button @click="logout()" class="button">Déconnexion</button>
    <button class="button">Modifié Compte</button>
    <button class="button">Supprimé Compte</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  mounted: function () {
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getUserInfos");
  },
  computed: {
    ...mapState({
      user: "userInfos",
    }),
  },
  methods: {
    logout: function () {
      this.$store.commit("logout");
      this.$router.push("/");
    },
  },
};
</script>
<style>
.card_user {
  color: rgb(241, 6, 6);
  font-weight: bold;
  font-size: 110%;
}
</style>
