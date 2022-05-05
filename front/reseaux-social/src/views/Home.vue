<template>
  <h1>Bienvenue</h1>
  <div class="messages">
    <button @click="switchToCreateMessage()" v-if="mode == ''" class="button">
      créer un post
    </button>
    <input
      aria-label="input Titre du message"
      v-model="title"
      v-if="mode == 'createMessage'"
      class="form-row1"
      type="text"
      placeholder="Titre"
    />
    <input
      aria-label="input contenu du message"
      v-model="content"
      v-if="mode == 'createMessage'"
      class="form-row1"
      type="text"
      placeholder="Contenu"
    />
    <button
      aria-label="boutton validation creation du message"
      class="button"
      v-if="mode == 'createMessage'"
      @click="createMessage()"
    >
      Poster
    </button>
    <h3 class="card-header">Derniers sujet</h3>

    <div class="card-body" v-for="Message in messages" :key="Message.id">
      <div class="Message">
        <div class="Title-message">Titre message {{ Message.title }}</div>
        <div class="modify">
          <button
            @click="switchToModifyMessage()"
            class="button"
            aria-label="boutton pour passer en mode modification du message"
          >
            Modifié
          </button>

          <input
            aria-label="input pour rentrer le titre modifié"
            v-model="title_modify"
            v-if="mode == 'modifyMessage'"
            class="form-row1"
            type="text"
            placeholder="Titre modifié"
          />
          <input
            aria-label="input pour le contenu modifié"
            v-model="content_modify"
            v-if="mode == 'modifyMessage'"
            class="form-row1"
            type="text"
            placeholder="contenu modifié"
          />
          <button
            aria-label="Boutton pour sauvegarder la modification du message"
            class="button"
            v-if="mode == 'modifyMessage'"
            @click="updateMessages(Message.id)"
          >
            Poster
          </button>
          <button
            aria-label="Boutton pour supprimer le message"
            class="button"
            v-if="mode == 'modifyMessage'"
            @click="deleteMessages(Message.id)"
          >
            Supprimer le poste
          </button>
        </div>
        id du message => {{ Message.id }}
        <div class="content">Contenu du message {{ Message.content }}</div>
        <div class="User">
          Createur du message => {{ Message.username }}
          {{ Message.UserId }}
        </div>
        <div class="like">
          like =>

          <i v-if="Message.likes > '0'" class="fa-solid fa-heart"></i>
          <i v-if="Message.likes <= '0'" class="fa-regular fa-heart"></i>
          <div class="like-dislike-icon">
            <button
              aria-label="Boutton pour liker le message"
              class="button-like"
              @click="likeMessages(Message.id)"
              :key="like"
            >
              <i class="fa-solid fa-thumbs-up"></i>
            </button>
            {{ Message.likes }}
            <button
              aria-label="Boutton pour disliker le message"
              class="button-dislike"
              @click="dislikeMessages(Message.id)"
            >
              <i class="fa-solid fa-thumbs-down"></i>
            </button>
          </div>
        </div>
        <div class="creation">date création {{ Message.createdAt }}</div>
      </div>
      <div class="Commentaires">
        <button
          aria-label="Boutton pour afficher les commentaires du message"
          @click="GetComments(Message.id)"
          class="button"
        >
          Affiché les comm
        </button>
        <p>Les commentaires seront ici</p>

        <div class="com" v-for="comments in comment" :key="comments">
          <div class="Grand-Com" v-if="Message.id == comments.messageId">
            <div class="User_Post_Comment">
              {{ comments.User.username }} à poster un commentaire
            </div>
            <p class="Post_Comment">
              {{ comments.content }}
            </p>
            <div class="date_Post_Comment">
              date de création du commentaire: {{ comments.createdAt }}
            </div>

            <div class="modif_Comm">
              <button
                aria-label="Boutton pour modifier le commentaire"
                @click="switchToModifyComment()"
                class="button"
                v-if="mode == ''"
              >
                modifié le commentaire
              </button>
              <input
                aria-label="input pour le contenue modifier du commentaire"
                v-model="Comment_Content_modify"
                v-if="mode == 'modifyComment'"
                class="form-row1"
                type="text"
                placeholder="contenu modifié"
              />
              <button
                aria-label="Boutton pour valider la modification du message"
                class="button"
                @click="updateComment(Message.id, comments.id)"
                v-if="mode == 'modifyComment'"
              >
                Poster le commentaire modifié
              </button>
              <button
                aria-label="Boutton pour supprimer le commentaire"
                class="button"
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
          class="form-row1"
          type="text"
          placeholder="Poster un commentaire"
          v-if="mode == ''"
        />
        <button
          aria-label="Boutton pour valider le poste du commentaire"
          class="button"
          v-if="mode == ''"
          @click="createComments(Message.id, Commentid)"
        >
          poster le commentaire
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

      this.$router.push("/Enregistrer");
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
      this.$router.push("/Enregistrer");
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
      this.$router.push("/Enregistrer");
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

      this.$router.push("/Enregistrer");
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
      this.$router.push("/Enregistrer");
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
      this.$router.push("/Enregistrer");
    },
  },
};
computed: {
}
</script>
<style>
.button {
  color: #6d68f5;
  border-style: outset;
  border-color: rgb(230, 122, 110);
  border-radius: 25%;
  background-color: antiquewhite;
  margin-block-start: 5px;
  margin-block-end: 5px;
}
.messages {
  display: inline-block;
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
  margin-block-start: 15px;
  margin-block-end: 15px;
  border-radius: 50px;
}
.Grand-Com {
  border-radius: 20px;
  border-style: dotted;
  border-color: rgb(230, 122, 110);
  margin-block-start: 10px;
}
.Message {
  border-radius: 20px;
  border-style: dotted;
  border-color: rgb(230, 122, 110);
  margin-block-start: 10px;
}
</style>
