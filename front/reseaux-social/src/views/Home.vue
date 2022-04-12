<template>
  <h1>Bienvenue</h1>
  <div class="messages">
    <h3 class="card-header">Derniers sujet</h3>
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

import axios from "axios";

export default {
  name: "get-request-async-await",

  data() {
    return {
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
};
</script>
<style>
.card-body {
  background-color: antiquewhite;
  margin-block-end: 30px;
}
</style>
