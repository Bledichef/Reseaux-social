<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title" v-if="mode == 'login'">
          <i class="fas fa-sign-in-alt"></i>
          Connexion
        </h1>
        <h1 class="auth-title" v-if="mode == 'create'">
          <i class="fas fa-user-plus"></i>
          Créer un compte
        </h1>
        <p class="auth-subtitle" v-if="mode == 'login'">
          Connectez-vous pour accéder à votre réseau social
        </p>
        <p class="auth-subtitle" v-if="mode == 'create'">
          Rejoignez notre communauté dès maintenant
        </p>
      </div>

      <div class="auth-switch">
        <button
          v-if="mode == 'login'"
          class="btn-link"
          @click="switchToCreateAccount()"
          aria-label="passé en mode inscription"
        >
          Vous n'avez pas encore de compte ?
          <strong>Créer un compte</strong>
        </button>
        <button
          v-if="mode == 'create'"
          class="btn-link"
          @click="switchToLogin()"
          aria-label="passé en mode login"
        >
          Vous avez déjà un compte ?
          <strong>Se connecter</strong>
        </button>
      </div>

      <form class="auth-form" @submit.prevent="mode == 'login' ? login() : createAccount()">
        <div class="form-group">
          <label for="email">
            <i class="fas fa-envelope"></i>
            Adresse email
          </label>
          <input
            id="email"
            aria-label="input email"
            v-model="email"
            class="input"
            type="email"
            placeholder="votre@email.com"
            required
          />
        </div>

        <div class="form-group" v-if="mode == 'create'">
          <label for="username">
            <i class="fas fa-user"></i>
            Nom et prénom
          </label>
          <input
            id="username"
            aria-label="input Nom et prenom de l'utilisateur"
            v-model="username"
            class="input"
            type="text"
            placeholder="Jean Dupont"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">
            <i class="fas fa-lock"></i>
            Mot de passe
          </label>
          <input
            id="password"
            aria-label="input mot de passe"
            v-model="password"
            class="input"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="form-group" v-if="mode == 'create'">
          <label for="job">
            <i class="fas fa-briefcase"></i>
            Profession
          </label>
          <input
            id="job"
            aria-label="input Job de l'utilisateur"
            v-model="job"
            class="input"
            type="text"
            placeholder="Développeur, Designer..."
            required
          />
        </div>

        <button
          aria-label="boutton validation login"
          type="submit"
          class="btn btn-primary btn-block"
          :class="{ 'btn-loading': status == 'loading' }"
          :disabled="!validatedFields || status == 'loading'"
          v-if="mode == 'login'"
        >
          <span v-if="status == 'loading'">
            <i class="fas fa-spinner fa-spin"></i>
            Connexion en cours...
          </span>
          <span v-else>
            <i class="fas fa-sign-in-alt"></i>
            Se connecter
          </span>
        </button>

        <button
          aria-label="boutton validation creation de compte"
          type="submit"
          class="btn btn-primary btn-block"
          :class="{ 'btn-loading': status == 'loading' }"
          :disabled="!validatedFields || status == 'loading'"
          v-else
        >
          <span v-if="status == 'loading'">
            <i class="fas fa-spinner fa-spin"></i>
            Création en cours...
          </span>
          <span v-else>
            <i class="fas fa-user-plus"></i>
            Créer mon compte
          </span>
        </button>
      </form>
    </div>
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
        return (
          this.email != "" &&
          this.username != "" &&
          this.password != "" &&
          this.job != ""
        );
      } else {
        return this.email != "" && this.password != "";
      }
    },
    ...mapState(["status"]),
  },
  mounted: function () {
    console.log("🔐 Mode actuel:", this.mode === "login" ? "LOGIN" : "CREATE");
  },
  watch: {
    mode: function (newMode) {
      console.log("🔄 Mode changé:", newMode === "login" ? "LOGIN" : "CREATE");
    },
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = "create";
      console.log("✅ Mode changé vers: CREATE (Création de compte)");
    },
    switchToLogin: function () {
      this.mode = "login";
      console.log("✅ Mode changé vers: LOGIN (Connexion)");
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
        })
        .catch(function (error) {
          console.log(error);
          alert(
            "Vérifiez le formulaire, il comporte une ou plusieurs erreurs"
          );
        });
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
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-xl);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.auth-switch {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-link {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.btn-link:hover {
  color: var(--primary-color);
}

.btn-link strong {
  color: var(--primary-color);
  margin-left: 0.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-group label i {
  color: var(--primary-color);
  width: 16px;
}

.input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input::placeholder {
  color: var(--text-muted);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
}

.btn-loading {
  position: relative;
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }

  .auth-card {
    padding: 2rem 1.5rem;
  }

  .auth-title {
    font-size: 1.75rem;
  }
}
</style>
