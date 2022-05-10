<template>
  <h1 class="card__title">A propos de vous</h1>

  <div class="card_user w3-container w3-center w3-animate-top">
    <p
      class="MAil w3-topbar w3-bottombar w3-leftbar w3-rightbar w3-border-amber"
    >
      Adresse Mail: {{ user.email }}
    </p>
    <p
      class="User w3-topbar w3-bottombar w3-leftbar w3-rightbar w3-border-amber"
    >
      Nom de l'utilisateur: {{ user.username }}
    </p>
    <p
      class="Job w3-topbar w3-bottombar w3-leftbar w3-rightbar w3-border-amber"
    >
      Fonction: {{ user.job }}
    </p>
  </div>

  <div class="form-row">
    <button
      aria-label="Boutton pour se déconnecter"
      @click="logout()"
      class="button"
    >
      <i class="fa-solid fa-right-from-bracket"></i> Déconnexion
    </button>
    <button
      aria-label="Boutton pour  passer en mode modification du profil"
      class="button"
      @click="switchToUpdate()"
    >
      <i class="fa-solid fa-pen-to-square"></i> Modifié Compte
    </button>
    <div class="upadte_user" v-if="mode == 'update'">
      <input
        class="w3-border-red w3-round-xlarge"
        aria-label="input pour modifier son nom et prenom"
        v-model="username"
        type="text"
        placeholder="Nom et prenom"
      />
      <input
        aria-label="input pour modifier son job"
        v-model="job"
        class="w3-border-red w3-round-xlarge"
        type="text"
        placeholder="Emploi"
      />
      <button
        aria-label="Boutton pour valider la modification du profil"
        class="button"
        @click="updateAccount()"
      >
        Enregistrer les modifications
      </button>
    </div>

    <button
      aria-label="Boutton pour supprimer le profil"
      class="buttonDelete"
      @click="deleteAccount()"
    >
      <i class="fa-solid fa-trash"></i> Supprimé Compte
    </button>
  </div>
</template>

<script>
import { mapState, Store } from "vuex";

export default {
  name: "Profile",
  mounted: function () {
    console.log(localStorage.user);
    // console.log(this.$store.state.user);
    if (localStorage.userId == -1 || localStorage.user == undefined) {
      this.$router.push("/Connexion");
      return;
    }
    this.$store.dispatch("getUserInfos");
  },
  data: function () {
    return {
      mode: "regular",
    };
  },

  computed: {
    ...mapState({
      user: "userInfos",
    }),
  },

  methods: {
    switchToUpdate: function () {
      this.mode = "update";
    },
    switchToNotLogin: function () {
      this.mode = "createAccount";
    },

    logout: function () {
      this.$store.commit("logout");
      // this.$router.push("/Connexion/");
    },

    updateAccount: function () {
      this.$store
        .dispatch("updateUser", {
          username: this.username,
          job: this.job,
        })
        .then(function (response) {
          console.log(response);
          getUserInfos();
        }),
        function (error) {
          console.log(error);
        };
      // alert("Veuillez vous reconnecter pour actualiser votre profil");
      // this.$router.push("/");
    },
    deleteAccount: function () {
      alert("Votre compte est supprimé");
      if (true) {
        this.$store.dispatch("deleteUser").then(function (response) {
          console.log(response);
        }),
          function (error) {
            console.log(error);
          };
        this.$router.push("/Connexion/");
      } else {
      }
    },
  },
};
</script>
<style>
.card_user {
  border-style: outset;
  width: 50%;
  display: inline-block;
  font-weight: bold;
  font-size: 110%;
  border-radius: 50px;
  background-color: antiquewhite;
  margin-block-end: 30px;
  margin-block-start: 20px;
}
.buttonDelete {
  color: #ffffff;
  border-style: outset;
  border-color: rgb(230, 122, 110);
  border-radius: 15%;
  background-color: rgb(252, 5, 5);
  /* margin-block-start: 5px;
  margin-block-end: 5px; */
  opacity: 0.8;
}
.buttonDelete:hover {
  opacity: 1;
  animation: shake 0.5s;
}
.form-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>
