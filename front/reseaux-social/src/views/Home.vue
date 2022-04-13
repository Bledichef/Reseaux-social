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
      <div class="content">Contenu du message {{ Message.content }}</div>
      <div class="User">Createur du message => {{ Message.UserId }}</div>
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
    createMessage: function () {
      this.$store
        .dispatch("postMessage", {
          title: this.title,
          content: this.content,
        })
        .then(function (response) {
          console.log(this.title);
          console.log(this.content);
          console.log(response);
          createMessage();
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
.card-body {
  background-color: antiquewhite;
  margin-block-end: 30px;
  margin-block-start: 20px;
}
</style>
