<template>
  <header></header>
  <h1 class="card_title" v-if="mode == 'login'">Se connecter à son Compte</h1>
  <h1 class="card_title" v-if="mode == 'create'">Se Créer un Compte</h1>
  <p class="card__subtitle" v-if="mode == 'login'">
    Tu n'as pas encore de compte?
    <span class="card_action" @click="switchToCreateAccount()">
      Créer un compte
    </span>
  </p>
  <p class="card__subtitle" v-if="mode == 'create'">
    Tu as déjà un compte ?
    <span class="card__action" @click="switchToLogin()">Se connecter</span>
  </p>
  <div class="form_input">
    <input class="form-row" type="text" placeholder="Adresse mail" />
    <input
      class="form-row"
      v-if="mode == 'create'"
      type="text"
      placeholder="Nom et prénom"
    />
    <input class="form-row" type="text" placeholder="Mot de passe" />
    <input
      class="form-row"
      v-if="mode == 'create'"
      type="text"
      placeholder="Emploi"
    />
  </div>
  <button class="button" v-if="mode == 'create'">Enregistrer</button>
  <button class="button" v-else>Connections</button>
</template>

<script>
export default {
  name: "login",
  data: function () {
    return {
      mode: "login",
    };
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = "create";
    },
    switchToLogin: function () {
      this.mode = "login";
    },
  },
};
</script>
<style>
.form_input {
  display: flex;
  flex-flow: column;
  max-width: 40%;
  margin-left: 30%;
}
.card_action {
  color: blue;
  font-weight: bold;
}
</style>
