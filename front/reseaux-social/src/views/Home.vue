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

    <div class="card-body" v-for="Message in messages" :key="Message">
      <div class="Title-message">Titre message {{ Message.title }}</div>
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
      <button v-if="mode == 'modifyMessage'" @click="updateMessages()">
        Poster
      </button>
      id du message => {{ Message.id }}
      <div class="content">Contenu du message {{ Message.content }}</div>
      <div class="User">Createur du message => {{ Message.UserId }}</div>
      <div class="like">
        like =>
        <!-- <font-awesome-icon icon="fa-solid fa-heart" /> -->
        <i class="fa-solid fa-heart"></i>
        <i class="fa-regular fa-heart"></i>

        {{ Message.likes }}
      </div>
      <div class="creation">date création {{ Message.createdAt }}</div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { computed } from "@vue/runtime-core";

export default {
  name: "Home",

  data() {
    return {
      mode: "",
      messages: {},
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
      window.location = `/Users/moi_b/OneDrive/Bureau/api%20rest/front/reseaux-social/dist/index.html#/`;
      // window.location.reload;
      // this.$router.reload("/");
    },
    updateMessages: function () {
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
