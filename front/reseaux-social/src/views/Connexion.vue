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
    <input
      v-model="email"
      class="form-row"
      type="text"
      placeholder="Adresse mail"
    />
    <input
      v-model="username"
      class="form-row"
      v-if="mode == 'create'"
      type="text"
      placeholder="Nom et prénom"
    />
    <input
      v-model="password"
      class="form-row"
      type="text"
      placeholder="Mot de passe"
    />
    <input
      v-model="job"
      class="form-row"
      v-if="mode == 'create'"
      type="text"
      placeholder="Emploi"
    />
  </div>
  <button
    @click="login()"
    class="button"
    :class="{ 'button--disabled': !validatedFields }"
    v-if="mode == 'login'"
  >
    <span v-if="status == 'loading'">Connexion en cours...</span>
    <span v-else>Connexion</span>
  </button>
  <button
    @click="createAccount()"
    class="button"
    :class="{ 'button--disabled': !validatedFields }"
    v-else
  >
    <span v-if="status == 'loading'">Création en cours...</span>
    <span v-else>Créer mon compte</span>
  </button>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "login",
  data: function () {
    return {
      mode: "login",
      email: "",
      username: "",
      password: "",
      job: "",
    };
  },
  computed: {
    validatedFields: function () {
      if (this.mode == "create") {
        if (
          this.email != "" &&
          this.username != "" &&
          this.password != "" &&
          this.job != ""
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapState(["status"]),
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = "create";
    },
    switchToLogin: function () {
      this.mode = "login";
    },
    login: function () {
      const self = this;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then(function (response) {
          self.$router.push("/Profile");
          console.log(response);
        }),
        function (error) {
          console.log(error);
        };
    },

    createAccount: function () {
      const self = this;
      console.log(this.email, this.username, this.password, this.job);
      this.$store
        .dispatch("createAccount", {
          email: this.email,
          username: this.username,
          password: this.password,
          job: this.job,
        })
        .then(function (response) {
          console.log(response);
          self.login();
        }),
        function (error) {
          console.log(error);
        };
    },
  },
};
</script>
<style>
body {
  background-color: rgba(30, 41, 104, 0.774);
  /* text-emphasis-color: #087ef5; */
}
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
