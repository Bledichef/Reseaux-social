<template>
  <header></header>
  <div class="w3-container w3-card-4 w3-padding-24">
    <h1 class="card_title" v-if="mode == 'login'">Se connecter à son Compte</h1>
    <h1 class="card_title" v-if="mode == 'create'">Se Créer un Compte</h1>
    <p class="card__subtitle" v-if="mode == 'login'">
      Tu n'as pas encore de compte?
      <button
        class="button w3-border-red w3-round-xlarge"
        @click="switchToCreateAccount()"
        aria-label="passé en mode inscription"
      >
        Créer un compte
      </button>
    </p>
    <p class="card__subtitle" v-if="mode == 'create'">
      Tu as déjà un compte ?
      <button
        class="button w3-border-red w3-round-xlarge"
        @click="switchToLogin()"
        aria-label="passé en mode login"
      >
        Se connecter
      </button>
    </p>
    <div class="form_input w3-container">
      <form class="w3-container">
        <input
          aria-label="input email"
          v-model="email"
          class="w3-margin w3-input"
          type="email"
          placeholder="Adresse mail"
        />

        <input
          aria-label="input Nom et prenom de l'utilisateur"
          v-model="username"
          class="w3-margin w3-input"
          v-if="mode == 'create'"
          type="text"
          placeholder="Nom et prénom"
        />

        <input
          aria-label="input mot de passe "
          v-model="password"
          class="w3-margin w3-input"
          type="password"
          placeholder="Mot de passe"
        />

        <input
          aria-label="input Job de l'utilisateur"
          v-model="job"
          class="w3-margin w3-input"
          v-if="mode == 'create'"
          type="text"
          placeholder="Emploi"
        />
      </form>
    </div>
    <button
      aria-label="boutton validation login"
      @click="login()"
      class="button w3-border-red w3-round-xlarge"
      :class="{ 'button--disabled': !validatedFields }"
      v-if="mode == 'login'"
    >
      <span v-if="status == 'loading'">Connexion en cours...</span>
      <span v-else>Connexion</span>
    </button>
    <button
      aria-label="boutton validation creation de compte"
      @click="createAccount()"
      class="button w3-border-red w3-round-xlarge"
      :class="{ 'button--disabled': !validatedFields }"
      v-else
    >
      <span v-if="status == 'loading'">Création en cours...</span>
      <span v-else>Créer mon compte</span>
    </button>
  </div>
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
          this.password != "PasswordRegex" &&
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
          self.$router.push("/");
          console.log(response);
        }),
        function (error) {
          console.log(error);
          alert(
            '"verifier le formulaire, il comporte une ou plusieurs erreurs"'
          );
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
  background-color: #0014f0;
  /* text-emphasis-color: #087ef5; */
}
/* .form_input {
  display: flex;
  flex-flow: column;
  max-width: 40%;
  margin-left: 30%;
} */
/* .card_action {
  color: rgb(255, 255, 255);
  font-weight: bold;
} */
</style>
