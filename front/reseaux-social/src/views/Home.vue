<template>
  <h1>Bienvenue</h1>
  <div class="messages w3-container">
    <button @click="switchToCreateMessage()" class="button w3-round-large">
      créer un post
    </button>
    <input
      aria-label="input Titre du message"
      v-model="title"
      v-if="mode == 'createMessage'"
      class="w3-border-red w3-round-xlarge"
      type="text"
      placeholder="Titre"
    />
    <input
      aria-label="input contenu du message"
      v-model="content"
      v-if="mode == 'createMessage'"
      class="w3-border-red w3-round-xlarge"
      type="text"
      placeholder="Contenu"
    />
    <button
      aria-label="boutton validation creation du message"
      class="button w3-round-xlarge"
      v-if="mode == 'createMessage'"
      @click="createMessage()"
    >
      Poster
    </button>
    <h3 class="card-header">Derniers sujet</h3>

    <div
      class="card-body w3-container w3-animate-zoom"
      v-for="Message in messages"
      :key="Message.id"
    >
      <div class="Message">
        <div class="Title-message w3-bottombar w3-xxlarge">
          {{ Message.title }}
        </div>
        <div class="modify w3-cell-row">
          <button
            v-if="mode == ''"
            @click="switchToModifyMessage()"
            class="button w3-round w3-small"
            aria-label="boutton pour passer en mode modification du message"
          >
            Modifier
          </button>

          <input
            aria-label="input pour rentrer le titre modifié"
            v-model="title_modify"
            v-if="mode == 'modifyMessage'"
            class="w3-border-red w3-round-xlarge w3-cell w3-mobile"
            type="text"
            placeholder="Titre modifié"
          />
          <input
            aria-label="input pour le contenu modifié"
            v-model="content_modify"
            v-if="mode == 'modifyMessage'"
            class="w3-border-red w3-round-xlarge w3-cell w3-mobile"
            type="text"
            placeholder="contenu modifié"
          />
          <button
            aria-label="Boutton pour sauvegarder la modification du message"
            class="button w3-round-xlarge w3-cell w3-mobile"
            v-if="mode == 'modifyMessage'"
            @click="updateMessages(Message.id)"
          >
            Poster
          </button>
          <button
            aria-label="Boutton pour supprimer le message"
            class="buttonDelete w3-round-xlarge w3-cell w3-mobile"
            v-if="mode == 'modifyMessage'"
            @click="deleteMessages(Message.id)"
          >
            Supprimer le poste
          </button>
        </div>
        <div class="content w3-border w3-card-2">
          <p class="w3-xlarge">{{ Message.content }}</p>
          <p w3-small>Createur du message {{ Message.username }}</p>
        </div>
        <div class="like">
          like =>

          <i v-if="Message.likes > '0'" class="fa-solid fa-heart"></i>
          <i v-if="Message.likes <= '0'" class="fa-regular fa-heart"></i>
          <div class="like-dislike-icon">
            <button
              aria-label="Boutton pour liker le message"
              class="button-like w3-round-xlarge w3-border-red"
              @click="likeMessages(Message.id)"
              :key="like"
            >
              <i class="fa-solid fa-thumbs-up"></i>
            </button>
            {{ Message.likes }}
            <button
              aria-label="Boutton pour disliker le message"
              class="button-dislike w3-round-xlarge w3-border-red"
              @click="dislikeMessages(Message.id)"
            >
              <i class="fa-solid fa-thumbs-down"></i>
            </button>
          </div>
        </div>
        <div class="creation w3-tiny">
          Date création {{ Date(Message.createdAt) }}
        </div>
      </div>
      <div class="Commentaires">
        <button
          aria-label="Boutton pour afficher les commentaires du message"
          @click="GetComments(Message.id)"
          class="button w3-round-xlarge"
        >
          Affiché les commentaires
        </button>

        <div class="com" v-for="comments in comment" :key="comments">
          <div class="Grand-Com" v-if="Message.id == comments.messageId">
            <div class="User_Post_Comment">
              {{ comments.User.username }} à poster un commentaire
            </div>
            <p class="Post_Comment w3-border w3-card-2 w3-xlarge">
              {{ comments.content }}
            </p>
            <div
              class="date_Post_Comment w3-tiny"
              v-if="comments.createdAt === comments.updatedAt"
            >
              Date de création du commentaire:
              {{ Date(comments.createdAt) }}
            </div>
            <div
              class="date_Edit_Comment w3-tiny"
              v-if="comments.createdAt != comments.updatedAt"
            >
              Date de Modification du commentaire:
              {{ Date(comments.createdAt) }}
            </div>
            <div class="modif_Comm">
              <button
                aria-label="Boutton pour modifier le commentaire"
                @click="switchToModifyComment()"
                class="button w3-round-xlarge"
                v-if="mode == ''"
              >
                Modifié le commentaire
              </button>
              <input
                aria-label="input pour le contenue modifier du commentaire"
                v-model="Comment_Content_modify"
                v-if="mode == 'modifyComment'"
                class="w3-border-red w3-round-xlarge"
                type="text"
                placeholder="contenu modifié"
              />
              <button
                aria-label="Boutton pour valider la modification du message"
                class="button w3-round-xlarge"
                @click="updateComment(Message.id, comments.id)"
                v-if="mode == 'modifyComment'"
              >
                Poster le commentaire modifié
              </button>
              <button
                aria-label="Boutton pour supprimer le commentaire"
                class="buttonDelete w3-round-xlarge"
                @click="deleteComment(Message.id, comments.id)"
                v-if="mode == 'modifyComment'"
              >
                Supprimer le commentaire
              </button>
            </div>
          </div>
        </div>
        <input
          aria-label="input pour contenu d'un commentaire"
          v-model="Post_comment"
          class="w3-border-red w3-round-xlarge"
          type="text"
          placeholder="Poster un commentaire"
          v-if="mode == ''"
        />
        <button
          aria-label="Boutton pour valider le poste du commentaire"
          class="button w3-round-xlarge"
          v-if="mode == ''"
          @click="createComments(Message.id, Commentid)"
        >
          Poster le commentaire
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { computed } from "@vue/runtime-core";
import router from "@/router";
import axios from "axios";

export default {
  name: "Home",

  data() {
    return {
      mode: "",
      messages: {},
      comment: "",
    };
  },

  async created() {
    // Simple GET request using fetch
    const response = await fetch("http://localhost:8080/api/messages");
    const data = await response.json();
    this.messages = data;

    console.log(this.messages);
    // console.log(data);
  },
  mounted() {
    console.log(localStorage.user);
    // console.log(this.$store.state.user);
    if (localStorage.userId == -1 || localStorage.user == undefined) {
      this.$router.push("/Connexion");
      return;
    }
    if (localStorage.Comment) {
      this.comment = JSON.parse(localStorage.Comment);
      // console.log(localStorage.Comment);
      console.log(this.comment);
      // console.log(this.messages);
    }
  },
  computed: {
    ...mapState({
      user: "userInfos",
    }),
  },

  methods: {
    switchToCreateMessage: function () {
      this.mode = "createMessage";
    },
    switchToModifyMessage: function () {
      this.mode = "modifyMessage";
    },
    switchToModifyComment: function () {
      this.mode = "modifyComment";
    },

    createMessage: function () {
      this.$store
        .dispatch("postMessage", {
          title: this.title,
          content: this.content,
        })

        .then(function (response) {
          console.log(response);
          // window.location.reload;
        }),
        function (error) {
          console.log(error);
        };

      // this.$router.push("/Enregistrer");
    },
    updateMessages: function (Messageid) {
      console.log(Messageid);
      localStorage.setItem("Messageid", JSON.stringify(Messageid));

      this.$store
        .dispatch("updateMessage", {
          title: this.title_modify,
          content: this.content_modify,
        })
        .then(function (response) {
          console.log(response);
          window.location.reload;
        }),
        function (error) {
          console.log(error);
        };
      // this.$router.push("/Enregistrer");
    },
    deleteMessages: function (Messageid) {
      console.log(Messageid);
      localStorage.setItem("Messageid", JSON.stringify(Messageid));

      this.$store.dispatch("deleteMessage", {}).then(function (response) {
        console.log(response);
        window.location.reload;
      }),
        function (error) {
          console.log(error);
        };
      // this.$router.push("/Enregistrer");
    },
    likeMessages: function (Messageid) {
      console.log(Messageid);

      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store.dispatch("likeMessage").then(function (response) {
        console.log(response);
      }),
        function (error) {
          console.log(error);
        };
      // this.$router.push("/Enregistrer");
    },
    dislikeMessages: function (Messageid) {
      console.log(Messageid);
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store.dispatch("dislikeMessage").then(function (response) {
        console.log(response);
      }),
        function (error) {
          console.log(error);
        };
      // this.$router.push("/Enregistrer");
    },
    GetComments: function (Messageid) {
      console.log(Messageid);
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store.dispatch("GetComment").then(function (response) {
        console.log(localStorage.Comment);
      }),
        function (error) {
          console.log(error);
        };
    },
    createComments: function (Messageid) {
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      console.log(Messageid);
      this.$store
        .dispatch("postComment", {
          content: this.Post_comment,
        })

        .then(function (response) {
          console.log(response);
          // window.location.reload;
        }),
        function (error) {
          console.log(error);
        };
      this.$store.dispatch("GetComment").then(function (response) {
        console.log(localStorage.Comment);
      }),
        function (error) {
          console.log(error);
        };
      // this.$router.push("/Enregistrer");
    },
    updateComment: function (Messageid, Commentid) {
      console.log(Messageid);
      console.log(Commentid);
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      localStorage.setItem("Commentid", JSON.stringify(Commentid));
      this.$store
        .dispatch("updateComment", {
          content: this.Comment_Content_modify,
        })
        .then(function (response) {
          console.log(response);
          window.location.reload;
          localStorage.removeItem("Comment");
        }),
        function (error) {
          console.log(error);
        };

      // this.$router.push("/Enregistrer");
    },
    deleteComment: function (Messageid, Commentid) {
      console.log(Messageid);
      console.log(Commentid);
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      localStorage.setItem("Commentid", JSON.stringify(Commentid));
      this.$store.dispatch("deleteComment", {}).then(function (response) {
        console.log(response);
        window.location.reload;
        localStorage.removeItem("Comment");
      }),
        function (error) {
          console.log(error);
        };
      // this.$router.push("/Enregistrer");
    },
  },
};
computed: {
}
</script>
<style>
/* .button {
  color: #6d68f5;
  border-style: outset;
  border-color: rgb(230, 122, 110);
  border-radius: 15%;
  background-color: antiquewhite;
  margin-block-start: 5px;
  margin-block-end: 5px;
  opacity: 0.6;
}
.button:hover {
  opacity: 1;
  animation: shake 0.5s;
}*/
.button-like {
  opacity: 0.6;
}
.button-like:hover {
  opacity: 1;
  animation: shake 0.5s;
}
.button-dislike {
  opacity: 0.6;
}
.button-dislike:hover {
  opacity: 1;
  animation: shake 0.5s;
}
.messages {
  display: flow-root;
  margin-left: 50px;
  margin-right: 50px;
}
/* .Title-message {
  border-style: outset;
  border-color: rgb(230, 122, 110);
  border-radius: 5%;
}
.like {
  border-style: solid;
  border-color: rgb(230, 122, 110);
} */
.card-body {
  border-style: groove;
  border-color: rgb(230, 122, 110);
  border-radius: 30px;
  background-color: antiquewhite;
  margin-block-end: 30px;
  margin-block-start: 20px;
}
.fa-solid {
  width: 200%;
}
.Commentaires {
  margin-left: 20px;
  margin-right: 20px;
  /* margin-block-start: 15px;
  margin-block-end: 15px; */
  border-radius: 50px;
}
.Grand-Com {
  border-radius: 20px;
  border-style: dotted;
  border-color: rgb(230, 122, 110);
  /* margin-block-start: 20px;
  margin-block-end: 20px; */
}
.Message {
  border-radius: 20px;
  border-style: dotted;
  border-color: rgb(230, 122, 110);
  margin-block-start: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
