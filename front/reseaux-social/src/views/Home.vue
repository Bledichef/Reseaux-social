<template>
  <div class="home-container">
    <div class="home-header">
      <h1 class="page-title">Fil d'actualité</h1>
      <button
        @click="switchToCreateMessage()"
        class="btn btn-primary"
        v-if="mode !== 'createMessage'"
      >
        <i class="fas fa-plus"></i>
        Créer un message
      </button>
    </div>

    <!-- Formulaire de création de message -->
    <div class="create-message-card" v-if="mode == 'createMessage'">
      <div class="card-header">
        <h3>Nouveau message</h3>
        <button @click="mode = ''" class="btn-icon">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="card-body">
        <input
          aria-label="input Titre du message"
          v-model="title"
          class="input"
          type="text"
          placeholder="Titre de votre message"
        />
        <textarea
          aria-label="input contenu du message"
          v-model="content"
          class="input textarea"
          placeholder="Que souhaitez-vous partager ?"
          rows="4"
        ></textarea>
        <div class="form-actions">
          <button
            aria-label="boutton validation creation du message"
            class="btn btn-primary"
            @click="createMessage()"
          >
            <i class="fas fa-paper-plane"></i>
            Publier
          </button>
          <button
            class="btn btn-secondary"
            @click="mode = ''"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des messages -->
    <div class="messages-list">
      <div
        class="message-card"
        v-for="Message in messages"
        :key="Message.id"
      >
        <!-- En-tête du message -->
        <div class="message-header">
          <div class="message-author">
            <div class="avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="author-info">
              <span class="author-name">{{ Message.username || 'Utilisateur' }}</span>
              <span class="message-date">{{ formatDate(Message.createdAt) }}</span>
            </div>
          </div>
          <div class="message-actions" v-if="mode == ''">
            <button
              @click="switchToModifyMessage()"
              class="btn-icon"
              aria-label="boutton pour passer en mode modification du message"
            >
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </div>

        <!-- Mode modification -->
        <div class="edit-form" v-if="mode == 'modifyMessage'">
          <input
            aria-label="input pour rentrer le titre modifié"
            v-model="title_modify"
            class="input"
            type="text"
            placeholder="Titre modifié"
          />
          <textarea
            aria-label="input pour le contenu modifié"
            v-model="content_modify"
            class="input textarea"
            placeholder="Contenu modifié"
            rows="4"
          ></textarea>
          <div class="form-actions">
            <button
              aria-label="Boutton pour sauvegarder la modification du message"
              class="btn btn-primary"
              @click="updateMessages(Message.id)"
            >
              <i class="fas fa-save"></i>
              Enregistrer
            </button>
            <button
              aria-label="Boutton pour supprimer le message"
              class="btn btn-danger"
              @click="deleteMessages(Message.id)"
            >
              <i class="fas fa-trash"></i>
              Supprimer
            </button>
            <button
              class="btn btn-secondary"
              @click="mode = ''"
            >
              Annuler
            </button>
          </div>
        </div>

        <!-- Contenu du message -->
        <div class="message-content" v-if="mode !== 'modifyMessage'">
          <h2 class="message-title">{{ Message.title }}</h2>
          <p class="message-text">{{ Message.content }}</p>
        </div>

        <!-- Actions (likes) -->
        <div class="message-footer">
          <div class="like-section">
            <button
              aria-label="Boutton pour liker le message"
              class="btn-like"
              @click="likeMessages(Message.id)"
            >
              <i class="fas fa-thumbs-up"></i>
              <span>{{ Message.likes || 0 }}</span>
            </button>
            <button
              aria-label="Boutton pour disliker le message"
              class="btn-like btn-dislike"
              @click="dislikeMessages(Message.id)"
            >
              <i class="fas fa-thumbs-down"></i>
            </button>
          </div>
          <button
            aria-label="Boutton pour afficher les commentaires du message"
            @click="GetComments(Message.id)"
            class="btn btn-secondary btn-sm"
          >
            <i class="fas fa-comments"></i>
            Commentaires
          </button>
        </div>

        <!-- Section commentaires -->
        <div class="comments-section">
          <!-- Liste des commentaires -->
          <div class="comment-card" v-for="comments in comment" :key="comments.id">
            <div v-if="Message.id == comments.messageId" class="comment">
              <div class="comment-header">
                <div class="comment-author">
                  <div class="avatar avatar-sm">
                    <i class="fas fa-user"></i>
                  </div>
                  <span class="comment-author-name">
                    {{ comments.User && comments.User.username ? comments.User.username : 'Utilisateur inconnu' }}
                  </span>
                </div>
                <span class="comment-date">
                  {{ formatDate(comments.createdAt) }}
                </span>
              </div>
              <p class="comment-content">{{ comments.content }}</p>
              
              <!-- Actions commentaire -->
              <div class="comment-actions" v-if="mode == ''">
                <button
                  aria-label="Boutton pour modifier le commentaire"
                  @click="switchToModifyComment()"
                  class="btn-link"
                >
                  <i class="fas fa-edit"></i>
                  Modifier
                </button>
                <button
                  aria-label="Boutton pour supprimer le commentaire"
                  @click="deleteComment(Message.id, comments.id)"
                  class="btn-link btn-link-danger"
                >
                  <i class="fas fa-trash"></i>
                  Supprimer
                </button>
              </div>

              <!-- Mode modification commentaire -->
              <div class="edit-comment-form" v-if="mode == 'modifyComment'">
                <textarea
                  aria-label="input pour le contenue modifier du commentaire"
                  v-model="Comment_Content_modify"
                  class="input textarea"
                  placeholder="Contenu modifié"
                  rows="3"
                ></textarea>
                <div class="form-actions">
                  <button
                    aria-label="Boutton pour valider la modification du message"
                    class="btn btn-primary btn-sm"
                    @click="updateComment(Message.id, comments.id)"
                  >
                    <i class="fas fa-save"></i>
                    Enregistrer
                  </button>
                  <button
                    class="btn btn-secondary btn-sm"
                    @click="mode = ''"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulaire nouveau commentaire -->
          <div class="new-comment" v-if="mode == ''">
            <input
              aria-label="input pour contenu d'un commentaire"
              v-model="Post_comment"
              class="input"
              type="text"
              placeholder="Écrire un commentaire..."
            />
            <button
              aria-label="Boutton pour valider le poste du commentaire"
              class="btn btn-primary btn-sm"
              @click="createComments(Message.id)"
            >
              <i class="fas fa-paper-plane"></i>
              Publier
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Message vide -->
    <div class="empty-state" v-if="messages.length === 0">
      <i class="fas fa-inbox"></i>
      <p>Aucun message pour le moment</p>
      <button @click="switchToCreateMessage()" class="btn btn-primary">
        Créer le premier message
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      mode: "",
      messages: [],
      comment: [],
      title: "",
      content: "",
      title_modify: "",
      content_modify: "",
      Post_comment: "",
      Comment_Content_modify: "",
      like: 0,
    };
  },
  async created() {
    const response = await fetch("http://localhost:8080/api/messages/");
    const data = await response.json();
    this.messages = data;
  },
  mounted() {
    if (localStorage.userId == -1 || localStorage.user == undefined) {
      this.$router.push("/Connexion");
      return;
    }
    if (localStorage.Comment) {
      try {
        this.comment = JSON.parse(localStorage.Comment);
        if (!Array.isArray(this.comment)) {
          this.comment = [];
        }
      } catch (e) {
        console.error("Erreur lors du parsing des commentaires:", e);
        this.comment = [];
      }
    }
  },
  computed: {
    ...mapState({
      user: "userInfos",
    }),
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    switchToCreateMessage() {
      this.mode = "createMessage";
    },
    switchToModifyMessage() {
      this.mode = "modifyMessage";
    },
    switchToModifyComment() {
      this.mode = "modifyComment";
    },
    createMessage() {
      this.$store
        .dispatch("postMessage", {
          title: this.title,
          content: this.content,
        })
        .then((response) => {
          console.log(response);
          this.title = "";
          this.content = "";
          this.mode = "";
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateMessages(Messageid) {
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store
        .dispatch("updateMessage", {
          title: this.title_modify,
          content: this.content_modify,
        })
        .then((response) => {
          console.log(response);
          this.mode = "";
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteMessages(Messageid) {
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store.dispatch("deleteMessage", {})
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    likeMessages(Messageid) {
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store.dispatch("likeMessage", { messageId: Messageid })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    dislikeMessages(Messageid) {
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store.dispatch("dislikeMessage", { messageId: Messageid })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    GetComments(Messageid) {
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store.dispatch("GetComment")
        .then((response) => {
          console.log(localStorage.Comment);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createComments(Messageid) {
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store
        .dispatch("postComment", {
          messageId: Messageid,
          content: this.Post_comment,
        })
        .then((response) => {
          console.log(response);
          this.Post_comment = "";
          this.$store.dispatch("GetComment");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateComment(Messageid, Commentid) {
      this.$store
        .dispatch("updateComment", {
          messageId: Messageid,
          commentId: Commentid,
          content: this.Comment_Content_modify || this.content_modify,
        })
        .then((response) => {
          console.log(response);
          this.mode = "";
          window.location.reload();
          localStorage.removeItem("Comment");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteComment(Messageid, Commentid) {
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return;
      this.$store
        .dispatch("deleteComment", {
          messageId: Messageid,
          commentId: Commentid,
        })
        .then((response) => {
          console.log(response);
          window.location.reload();
          localStorage.removeItem("Comment");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Boutons */
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
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

.btn-link {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.btn-link:hover {
  color: var(--primary-color);
}

.btn-link-danger:hover {
  color: var(--danger-color);
}

/* Cartes */
.create-message-card,
.message-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

.message-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Inputs */
.input {
  width: 100%;
  padding: 0.75rem 1rem;
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

.textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

/* Message */
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.message-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  font-size: 0.875rem;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
}

.message-date {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.message-content {
  margin-bottom: 1rem;
}

.message-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.message-text {
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.like-section {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-like {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-like:hover {
  background: var(--bg-hover);
  color: var(--success-color);
  border-color: var(--success-color);
}

.btn-dislike:hover {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

/* Commentaires */
.comments-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.comment-card {
  margin-bottom: 1rem;
}

.comment {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 1rem;
  border: 1px solid var(--border-color);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-author-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.comment-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.comment-content {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.comment-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.new-comment {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.edit-form,
.edit-comment-form {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .home-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .message-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }
}
</style>
