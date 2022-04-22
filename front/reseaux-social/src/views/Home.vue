<template>
  <h1>Bienvenue</h1>
  <div class="messages">
    <h3 class="card-header">Derniers sujet</h3>
    <button @click="switchToCreateMessage()" class="button">
      créer un post
    </button>
    <input
      v-model="title"
      v-if="mode == 'createMessage'"
      class="form-row"
      type="text"
      placeholder="Titre"
    />
    <input
      v-model="content"
      v-if="mode == 'createMessage'"
      class="form-row"
      type="text"
      placeholder="Contenu"
    />
    <button v-if="mode == 'createMessage'" @click="createMessage()">
      Poster
    </button>

    <div class="card-body" v-for="Message in messages" :key="Message.id">
      <div class="Title-message">Titre message {{ Message.title }}</div>
      <div class="modify">
        <button @click="switchToModifyMessage()" class="button">Modifié</button>
        <input
          v-model="title_modify"
          v-if="mode == 'modifyMessage'"
          class="form-row"
          type="text"
          placeholder="Titre modifié"
        />
        <input
          v-model="content_modify"
          v-if="mode == 'modifyMessage'"
          class="form-row"
          type="text"
          placeholder="contenu modifié"
        />
        <button
          v-if="mode == 'modifyMessage'"
          @click="updateMessages(Message.id)"
        >
          Poster
        </button>
      </div>
      id du message => {{ Message.id }}
      <div class="content">Contenu du message {{ Message.content }}</div>
      <div class="User">Createur du message => {{ Message.UserId }}</div>
      <div class="like">
        like =>

        <i v-if="Message.likes > '0'" class="fa-solid fa-heart"></i>
        <i v-if="Message.likes <= '0'" class="fa-regular fa-heart"></i>
        <div class="like-dislike-icon">
          <button
            class="button-like"
            @click="likeMessages(Message.id)"
            :key="like"
          >
            <i class="fa-solid fa-thumbs-up"></i>
          </button>
          {{ Message.likes }}
          <button class="button-dislike" @click="dislikeMessages(Message.id)">
            <i class="fa-solid fa-thumbs-down"></i>
          </button>
        </div>
      </div>
      <div class="creation">date création {{ Message.createdAt }}</div>
      <div class="Commentaires">
        <p>Les commentaires seront ici</p>

        {{ this.comment }}
        <button @click="GetComments(Message.id)">Affiché les comm</button>
        <div class="modif_Comm">
          <button
            @click="switchToModifyComment()"
            class="button_modif_com"
            v-if="mode == ''"
          >
            modifié le commentaire
          </button>
          <input
            v-model="Comment_Content_modify"
            v-if="mode == 'modifyComment'"
            class="form-row"
            type="text"
            placeholder="contenu modifié"
          />
          <button
            @click="updateComment(Message.id, Commentid)"
            v-if="mode == 'modifyComment'"
          >
            Poster le commentaire modifié
          </button>
        </div>
        <input
          v-model="Post_comment"
          class="form-row"
          type="text"
          placeholder="Poster un commentaire"
          v-if="mode == ''"
        />
        <button
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
      comment: {},
    };
  },
  async created() {
    // Simple GET request using fetch
    const response = await fetch("http://localhost:8080/api/messages");
    const data = await response.json();
    this.messages = data;

    console.log(this.messages);
    console.log(data);
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
    likeMessages: function (Messageid) {
      console.log(Messageid);
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store.dispatch("likeMessage").then(function (response) {
        console.log(response);
      }),
        function (error) {
          console.log(error);
        };
      this.$router.push("/Enregistrer");
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
      this.$router.push("/Enregistrer");
    },
    GetComments: function (Messageid) {
      console.log(Messageid);
      localStorage.setItem("Messageid", JSON.stringify(Messageid));
      this.$store.dispatch("GetComment").then(function (response) {
        console.log(localStorage.Comment);
        console.log(response);
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
.messages {
  display: inline-block;
}
.card-body {
  border-radius: 50px;
  background-color: antiquewhite;
  margin-block-end: 30px;
  margin-block-start: 20px;
}
.fa-solid {
  width: 200%;
}
</style>
