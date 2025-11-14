<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="profile-avatar">
        <div class="avatar-large">
          <i class="fas fa-user"></i>
        </div>
        <h1 class="profile-name" v-if="user">
          {{ user.username || 'Utilisateur' }}
        </h1>
        <p class="profile-job" v-if="user">{{ user.job }}</p>
      </div>
    </div>

    <div class="profile-card">
      <div class="card-header">
        <h2>
          <i class="fas fa-info-circle"></i>
          Informations du profil
        </h2>
      </div>

      <div class="profile-info" v-if="user">
        <div class="info-item">
          <div class="info-label">
            <i class="fas fa-envelope"></i>
            <span>Adresse email</span>
          </div>
          <div class="info-value">{{ user.email }}</div>
        </div>

        <div class="info-item">
          <div class="info-label">
            <i class="fas fa-user"></i>
            <span>Nom d'utilisateur</span>
          </div>
          <div class="info-value">{{ user.username }}</div>
        </div>

        <div class="info-item">
          <div class="info-label">
            <i class="fas fa-briefcase"></i>
            <span>Profession</span>
          </div>
          <div class="info-value">{{ user.job }}</div>
        </div>
      </div>

      <div v-else class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Chargement des informations utilisateur...</p>
      </div>
    </div>

    <!-- Mode modification -->
    <div class="profile-card" v-if="mode == 'update'">
      <div class="card-header">
        <h2>
          <i class="fas fa-edit"></i>
          Modifier mon profil
        </h2>
        <button @click="mode = 'regular'" class="btn-icon">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label for="username-edit">
            <i class="fas fa-user"></i>
            Nom et prénom
          </label>
          <input
            id="username-edit"
            class="input"
            aria-label="input pour modifier son nom et prenom"
            v-model="username"
            type="text"
            placeholder="Nom et prénom"
          />
        </div>
        <div class="form-group">
          <label for="job-edit">
            <i class="fas fa-briefcase"></i>
            Profession
          </label>
          <input
            id="job-edit"
            class="input"
            aria-label="input pour modifier son job"
            v-model="job"
            type="text"
            placeholder="Emploi"
          />
        </div>
        <div class="form-actions">
          <button
            aria-label="Boutton pour valider la modification du profil"
            class="btn btn-primary"
            @click="updateAccount()"
          >
            <i class="fas fa-save"></i>
            Enregistrer les modifications
          </button>
          <button
            class="btn btn-secondary"
            @click="mode = 'regular'"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="profile-actions">
      <button
        aria-label="Boutton pour passer en mode modification du profil"
        class="btn btn-primary"
        @click="switchToUpdate()"
        v-if="mode == 'regular'"
      >
        <i class="fas fa-edit"></i>
        Modifier mon profil
      </button>
      <button
        aria-label="Boutton pour se déconnecter"
        @click="logout()"
        class="btn btn-secondary"
      >
        <i class="fas fa-sign-out-alt"></i>
        Déconnexion
      </button>
      <button
        aria-label="Boutton pour supprimer le profil"
        class="btn btn-danger"
        @click="deleteAccount()"
      >
        <i class="fas fa-trash"></i>
        Supprimer mon compte
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Profile",
  mounted: function () {
    console.log(localStorage.user);
    if (localStorage.userId == -1 || localStorage.user == undefined) {
      this.$router.push("/Connexion");
      return;
    }
    this.$store.dispatch("getUserInfos").then(() => {
      if (this.user) {
        this.username = this.user.username || "";
        this.job = this.user.job || "";
      }
    });
  },
  data: function () {
    return {
      mode: "regular",
      username: "",
      job: "",
    };
  },
  computed: {
    ...mapState({
      user: "userInfos",
    }),
  },
  watch: {
    user: {
      handler(newUser) {
        if (newUser) {
          this.username = newUser.username || "";
          this.job = newUser.job || "";
        }
      },
      immediate: true,
    },
  },
  methods: {
    switchToUpdate: function () {
      this.mode = "update";
    },
    logout: function () {
      this.$store.commit("logout");
      this.$router.push("/Connexion");
    },
    updateAccount: function () {
      this.$store
        .dispatch("updateUser", {
          username: this.username,
          job: this.job,
        })
        .then((response) => {
          console.log(response);
          this.$store.dispatch("getUserInfos");
          this.mode = "regular";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteAccount: function () {
      if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
        return;
      }
      this.$store.dispatch("deleteUser")
        .then((response) => {
          console.log(response);
          alert("Votre compte a été supprimé");
          this.$router.push("/Connexion");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  box-shadow: var(--shadow-xl);
  border: 4px solid var(--bg-card);
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.profile-job {
  font-size: 1.125rem;
  color: var(--text-muted);
  margin: 0;
}

.profile-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
}

.info-label i {
  color: var(--primary-color);
  width: 16px;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-primary);
}

.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.loading-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
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

.form-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--bg-hover);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

.btn-danger {
  background: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.btn-icon {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .profile-actions {
    flex-direction: column;
  }

  .profile-actions .btn {
    width: 100%;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
